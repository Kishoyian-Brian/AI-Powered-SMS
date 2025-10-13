import { SetMetadata } from '@nestjs/common';

export enum Permission {
  // Student Permissions
  READ_STUDENTS = 'read:students',
  CREATE_STUDENTS = 'create:students',
  UPDATE_STUDENTS = 'update:students',
  DELETE_STUDENTS = 'delete:students',
  
  // Teacher Permissions
  READ_TEACHERS = 'read:teachers',
  CREATE_TEACHERS = 'create:teachers',
  UPDATE_TEACHERS = 'update:teachers',
  DELETE_TEACHERS = 'delete:teachers',
  
  // Class Permissions
  READ_CLASSES = 'read:classes',
  CREATE_CLASSES = 'create:classes',
  UPDATE_CLASSES = 'update:classes',
  DELETE_CLASSES = 'delete:classes',
  
  // Assignment Permissions
  READ_ASSIGNMENTS = 'read:assignments',
  CREATE_ASSIGNMENTS = 'create:assignments',
  UPDATE_ASSIGNMENTS = 'update:assignments',
  DELETE_ASSIGNMENTS = 'delete:assignments',
  GRADE_ASSIGNMENTS = 'grade:assignments',
  SUBMIT_ASSIGNMENTS = 'submit:assignments',
  
  // Grade Permissions
  READ_GRADES = 'read:grades',
  CREATE_GRADES = 'create:grades',
  UPDATE_GRADES = 'update:grades',
  DELETE_GRADES = 'delete:grades',
  
  // Attendance Permissions
  READ_ATTENDANCE = 'read:attendance',
  CREATE_ATTENDANCE = 'create:attendance',
  UPDATE_ATTENDANCE = 'update:attendance',
  DELETE_ATTENDANCE = 'delete:attendance',
  
  // Report Permissions
  READ_REPORTS = 'read:reports',
  CREATE_REPORTS = 'create:reports',
  
  // Admin Permissions
  MANAGE_SCHOOL = 'manage:school',
  VIEW_ALL_DATA = 'view:all',
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

