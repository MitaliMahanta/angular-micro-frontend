import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  loading = false;

  categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Health & Beauty',
    'Automotive'
  ];

  statuses = [
    'Active',
    'Inactive',
    'Discontinued'
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.isEditMode = !!data;
    this.productForm = this.createForm();
  }

  ngOnInit() {
    if (this.isEditMode && this.data) {
      this.productForm.patchValue(this.data);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      description: [''],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['Active', Validators.required],
      tags: ['']
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;
      const formValue = this.productForm.value;
      
      // Process tags
      if (formValue.tags) {
        formValue.tags = formValue.tags.split(',').map((tag: string) => tag.trim());
      }

      const operation = this.isEditMode
        ? this.productService.updateProduct(this.data!.id, formValue)
        : this.productService.createProduct(formValue);

      operation.subscribe({
        next: (result) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('min')) {
      return `${fieldName} must be greater than ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('pattern')) {
      return `${fieldName} format is invalid`;
    }
    return '';
  }
}