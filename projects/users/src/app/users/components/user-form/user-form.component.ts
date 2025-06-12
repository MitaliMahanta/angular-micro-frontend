import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User, UserRole, UserStatus } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  loading = false;
  departments: string[] = [];

  userRoles = Object.values(UserRole);
  userStatuses = Object.values(UserStatus);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.isEditMode = !!data;
    this.userForm = this.createForm();
  }

  ngOnInit() {
    this.loadDepartments();
    
    if (this.isEditMode && this.data) {
      this.userForm.patchValue({
        ...this.data,
        permissions: this.data.permissions?.join(', ') || ''
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      role: [UserRole.USER, Validators.required],
      status: [UserStatus.ACTIVE, Validators.required],
      department: [''],
      position: [''],
      permissions: ['']
    });
  }

  loadDepartments() {
    this.userService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      const formValue = { ...this.userForm.value };
      
      // Process permissions
      if (formValue.permissions) {
        formValue.permissions = formValue.permissions
          .split(',')
          .map((perm: string) => perm.trim())
          .filter((perm: string) => perm.length > 0);
      } else {
        formValue.permissions = [];
      }

      const operation = this.isEditMode
        ? this.userService.updateUser(this.data!.id, formValue)
        : this.userService.createUser(formValue);

      operation.subscribe({
        next: (result) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving user:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('pattern')) {
      return `${fieldName} format is invalid`;
    }
    return '';
  }
}