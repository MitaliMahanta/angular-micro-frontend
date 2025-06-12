import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { User, UserRole, UserStatus, UserStats } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['avatar', 'name', 'email', 'role', 'department', 'status', 'lastLogin', 'actions'];
  dataSource = new MatTableDataSource<User>();
  searchControl = new FormControl('');
  roleFilter = new FormControl('');
  statusFilter = new FormControl('');
  departmentFilter = new FormControl('');
  loading = false;
  stats: UserStats | null = null;

  userRoles = Object.values(UserRole);
  userStatuses = Object.values(UserStatus);
  departments: string[] = [];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadStats();
    this.loadDepartments();
    this.setupFilters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  loadStats() {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
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

  setupFilters() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilter());

    this.roleFilter.valueChanges.subscribe(() => this.applyFilter());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilter());
    this.departmentFilter.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter() {
    const searchValue = this.searchControl.value || '';
    const roleValue = this.roleFilter.value || '';
    const statusValue = this.statusFilter.value || '';
    const departmentValue = this.departmentFilter.value || '';
    
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchMatch = !searchValue || 
        data.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        (data.department && data.department.toLowerCase().includes(searchValue.toLowerCase())) ||
        (data.position && data.position.toLowerCase().includes(searchValue.toLowerCase()));
      
      const roleMatch = !roleValue || data.role === roleValue;
      const statusMatch = !statusValue || data.status === statusValue;
      const departmentMatch = !departmentValue || data.department === departmentValue;
      
      return searchMatch && roleMatch && statusMatch && departmentMatch;
    };
    
    this.dataSource.filter = searchValue + roleValue + statusValue + departmentValue;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserForm(user?: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '700px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.loadStats();
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          this.loadStats();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  toggleUserStatus(user: User) {
    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    this.userService.updateUser(user.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadUsers();
        this.loadStats();
      },
      error: (error) => {
        console.error('Error updating user status:', error);
      }
    });
  }

  getStatusColor(status: UserStatus): string {
    switch (status) {
      case UserStatus.ACTIVE: return 'primary';
      case UserStatus.INACTIVE: return 'warn';
      case UserStatus.SUSPENDED: return 'warn';
      case UserStatus.PENDING: return 'accent';
      default: return '';
    }
  }

  getRoleColor(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'warn';
      case UserRole.MANAGER: return 'primary';
      case UserRole.USER: return 'accent';
      case UserRole.GUEST: return '';
      default: return '';
    }
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
}