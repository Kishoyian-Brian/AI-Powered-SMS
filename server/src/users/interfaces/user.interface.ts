export interface User {
  id: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: Date;
  updatedAt: Date;
}