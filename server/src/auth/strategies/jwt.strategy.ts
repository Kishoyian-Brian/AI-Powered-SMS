import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // Payload contains: { sub: userId, email, role }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Determine the specific role ID (student/teacher/admin id)
    let roleId: string | null = null;
    if (user.student) roleId = user.student.id;
    if (user.teacher) roleId = user.teacher.id;
    if (user.admin) roleId = user.admin.id;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      userId: roleId, // The specific student/teacher/admin ID
    };
  }
}

