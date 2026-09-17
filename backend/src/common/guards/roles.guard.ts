import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/rcba.enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('Accès refusé : utilisateur non authentifié ou rôle indéfini');
    }

    // Un ADMINISTRATEUR a un accès complet aux opérations
    if (user.role === Role.ADMINISTRATEUR) {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role as Role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Permissions insuffisantes. Rôles requis : ${requiredRoles.join(', ')} (votre rôle : ${user.role})`
      );
    }

    return true;
  }
}
