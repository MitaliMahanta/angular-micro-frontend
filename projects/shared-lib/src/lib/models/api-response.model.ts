export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: Date;
  errors?: string[];
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}