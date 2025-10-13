import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Permission, PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (!requiredPermissions) {
      return true; // No permissions required
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    const userPermissions = this.getUserPermissions(user.role);
    
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
    
    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
      );
    }
    
    return true;
  }

  private getUserPermissions(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.ADMIN:
        // Admin has all permissions
        return Object.values(Permission);
      
      case UserRole.TEACHER:
        return [
          // Students - read only
          Permission.READ_STUDENTS,
          
          // Classes - manage own classes
          Permission.READ_CLASSES,
          Permission.UPDATE_CLASSES,
          
          // Assignments - full control
          Permission.READ_ASSIGNMENTS,
          Permission.CREATE_ASSIGNMENTS,
          Permission.UPDATE_ASSIGNMENTS,
          Permission.DELETE_ASSIGNMENTS,
          Permission.GRADE_ASSIGNMENTS,
          
          // Grades - full control
          Permission.READ_GRADES,
          Permission.CREATE_GRADES,
          Permission.UPDATE_GRADES,
          Permission.DELETE_GRADES,
          
          // Attendance - full control
          Permission.READ_ATTENDANCE,
          Permission.CREATE_ATTENDANCE,
          Permission.UPDATE_ATTENDANCE,
          Permission.DELETE_ATTENDANCE,
          
          // Reports - read and create
          Permission.READ_REPORTS,
          Permission.CREATE_REPORTS,
        ];
      
      case UserRole.STUDENT:
        return [
          // Can only view own data
          Permission.READ_ASSIGNMENTS,
          Permission.SUBMIT_ASSIGNMENTS,
          Permission.READ_GRADES,
          Permission.READ_ATTENDANCE,
        ];
      
      default:
        return [];
    }
  }
}

