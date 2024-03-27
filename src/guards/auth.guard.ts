import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DEFAULT_TENANT, IS_PUBLIC_KEY, getTenantId } from '../helpers';
import { JWT_SECRET } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });

      //TODO: Crear guard para validar el tenant similar a IS PUBLIC
      
      //TODO: Validar que el tenant pertenezca al usuario

      const tenantId = request?.headers?.host.split('.')[0];

      if (!payload.tenantId) payload.tenantId = DEFAULT_TENANT;

      if (tenantId != payload.tenantId) {
        Logger.error(
          `Error: host tenant: ${tenantId}; user tenant: ${payload.tenantId}`,
        );
        throw new UnauthorizedException();
      }

      request['user'] = payload;
      request['tenantId'] = tenantId;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
