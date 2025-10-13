import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * Guard to ensure users can only access their own resources
 * Admins can access all resources
 * Teachers can access their own resources + their students/classes
 * Students can only access their own resources
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    // Admin can access everything
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    
    // Check if user is accessing their own resource
    const resourceId = params.id || params.studentId || params.teacherId;
    
    if (!resourceId) {
      return true; // No specific resource ID to check
    }
    
    // For students and teachers, check if they own the resource
    if (user.userId === resourceId || user.id === resourceId) {
      return true;
    }
    
    // For teachers, additional logic could be added here to check
    // if they're accessing a student/class they teach
    // This would require injecting services to check relationships
    
    throw new ForbiddenException('You can only access your own resources');
  }
}

