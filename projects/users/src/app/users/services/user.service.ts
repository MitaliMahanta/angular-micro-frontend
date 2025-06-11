import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { User, UserRole, UserStatus, UserFilter, UserStats } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  
  // Mock data for demonstration
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: '+1-555-0101',
      department: 'IT',
      position: 'System Administrator',
      lastLogin: new Date('2024-01-20T09:30:00'),
      createdAt: new Date('2023-01-15T10:00:00'),
      updatedAt: new Date('2024-01-20T09:30:00'),
      permissions: ['users.read', 'users.write', 'orders.read', 'orders.write', 'products.read', 'products.write']
    },
    {
      id: '2',
      email: 'manager@example.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      phone: '+1-555-0102',
      department: 'Sales',
      position: 'Sales Manager',
      lastLogin: new Date('2024-01-19T14:20:00'),
      createdAt: new Date('2023-03-10T11:00:00'),
      updatedAt: new Date('2024-01-19T14:20:00'),
      permissions: ['orders.read', 'orders.write', 'products.read', 'users.read']
    },
    {
      id: '3',
      email: 'user1@example.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      phone: '+1-555-0103',
      department: 'Marketing',
      position: 'Marketing Specialist',
      lastLogin: new Date('2024-01-18T16:45:00'),
      createdAt: new Date('2023-06-20T09:00:00'),
      updatedAt: new Date('2024-01-18T16:45:00'),
      permissions: ['products.read', 'orders.read']
    },
    {
      id: '4',
      email: 'user2@example.com',
      firstName: 'Emily',
      lastName: 'Davis',
      role: UserRole.USER,
      status: UserStatus.INACTIVE,
      phone: '+1-555-0104',
      department: 'HR',
      position: 'HR Coordinator',
      lastLogin: new Date('2024-01-10T11:30:00'),
      createdAt: new Date('2023-08-15T14:00:00'),
      updatedAt: new Date('2024-01-15T10:00:00'),
      permissions: ['users.read']
    },
    {
      id: '5',
      email: 'guest@example.com',
      firstName: 'Alex',
      lastName: 'Guest',
      role: UserRole.GUEST,
      status: UserStatus.PENDING,
      phone: '+1-555-0105',
      department: 'External',
      position: 'Consultant',
      createdAt: new Date('2024-01-18T12:00:00'),
      updatedAt: new Date('2024-01-18T12:00:00'),
      permissions: []
    },
    {
      id: '6',
      email: 'suspended@example.com',
      firstName: 'Tom',
      lastName: 'Suspended',
      role: UserRole.USER,
      status: UserStatus.SUSPENDED,
      phone: '+1-555-0106',
      department: 'Finance',
      position: 'Accountant',
      lastLogin: new Date('2024-01-05T08:15:00'),
      createdAt: new Date('2023-04-12T13:00:00'),
      updatedAt: new Date('2024-01-12T15:30:00'),
      permissions: []
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(filter?: UserFilter): Observable<User[]> {
    let filteredUsers = [...this.mockUsers];
    
    if (filter?.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.department?.toLowerCase().includes(searchTerm) ||
        user.position?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filter?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filter.role);
    }
    
    if (filter?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filter.status);
    }
    
    if (filter?.department) {
      filteredUsers = filteredUsers.filter(user => user.department === filter.department);
    }
    
    return of(filteredUsers).pipe(delay(500));
  }

  getUser(id: string): Observable<User> {
    const user = this.mockUsers.find(u => u.id === id);
    return of(user!).pipe(delay(300));
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: (this.mockUsers.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockUsers.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = {
        ...this.mockUsers[index],
        ...user,
        updatedAt: new Date()
      };
      return of(this.mockUsers[index]).pipe(delay(500));
    }
    
    throw new Error('User not found');
  }

  deleteUser(id: string): Observable<void> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
    }
    
    return of(void 0).pipe(delay(300));
  }

  getUserStats(): Observable<UserStats> {
    const stats: UserStats = {
      totalUsers: this.mockUsers.length,
      activeUsers: this.mockUsers.filter(u => u.status === UserStatus.ACTIVE).length,
      newUsersThisMonth: this.mockUsers.filter(u => {
        const now = new Date();
        const userDate = new Date(u.createdAt);
        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
      }).length,
      usersByRole: {
        [UserRole.ADMIN]: this.mockUsers.filter(u => u.role === UserRole.ADMIN).length,
        [UserRole.MANAGER]: this.mockUsers.filter(u => u.role === UserRole.MANAGER).length,
        [UserRole.USER]: this.mockUsers.filter(u => u.role === UserRole.USER).length,
        [UserRole.GUEST]: this.mockUsers.filter(u => u.role === UserRole.GUEST).length
      },
      usersByStatus: {
        [UserStatus.ACTIVE]: this.mockUsers.filter(u => u.status === UserStatus.ACTIVE).length,
        [UserStatus.INACTIVE]: this.mockUsers.filter(u => u.status === UserStatus.INACTIVE).length,
        [UserStatus.SUSPENDED]: this.mockUsers.filter(u => u.status === UserStatus.SUSPENDED).length,
        [UserStatus.PENDING]: this.mockUsers.filter(u => u.status === UserStatus.PENDING).length
      }
    };
    
    return of(stats).pipe(delay(300));
  }

  getDepartments(): Observable<string[]> {
    const departments = [...new Set(this.mockUsers.map(u => u.department).filter(Boolean))];
    return of(departments as string[]).pipe(delay(200));
  }
}