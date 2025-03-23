import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../infrastructure/auth/decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) return true; // Si no se especificaron roles, permitir acceso.

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.decode(token) as { roles: string[] };

    if (!decoded || !decoded.roles) throw new ForbiddenException('Invalid token');

    const hasRole = requiredRoles.some((role) => decoded.roles.includes(role));
    if (!hasRole) throw new ForbiddenException('Access denied');

    return true;
  }
}
