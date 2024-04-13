import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DEFAULT_TENANT, IS_PUBLIC_KEY } from '@helpers';
import { JWT_SECRET } from '../config';
import { TenantService } from '../modules/tenant/tenant.service';
import { AccessTokenContent } from 'src/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private tenantService: TenantService,
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
      const payload = await this.jwtService.verifyAsync<AccessTokenContent>(
        token,
        {
          secret: JWT_SECRET,
        },
      );

      //TODO: Crear guard para validar el tenant similar a IS PUBLIC
      const tenantId = request?.headers?.host.split('.')[0] || DEFAULT_TENANT;

      // Validar que el tenant exista y pertenezca al usuario
      if (!this.tenantService.isUserTenantValid(tenantId, payload.userId)) {
        const error = `Error: User: ${payload.userId} does not have the tenant: ${tenantId}`;
        Logger.error(error);
        throw new UnauthorizedException(error);
      }

      // Si el token no tiene tenant asignar el tenant por defecto
      if (!payload.tenantId) payload.tenantId = DEFAULT_TENANT;

      // Validar que el tenant del token y el tenant del request sea el mismo
      if (tenantId != payload.tenantId) {
        const error = `Error: host tenant: ${tenantId}; user tenant: ${payload.tenantId}`;
        Logger.error(error);
        throw new UnauthorizedException(error);
      }

      request['user'] = payload;
      request['tenantId'] = tenantId;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
