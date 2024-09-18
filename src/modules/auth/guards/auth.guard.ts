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
import {
  DEFAULT_TENANT,
  IS_PUBLIC_KEY,
  IS_PUBLIC_TENANT_KEY,
  JWT_SECRET,
} from '@config';
import { AccessTokenContent } from '../interfaces';
import { CompanyService } from '../../company/company.service';
import { getTenantFromRequest } from '@helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private companyService: CompanyService,
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
      throw new UnauthorizedException({
        show: true,
        message: 'Invalid token',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenContent>(
        token,
        {
          secret: JWT_SECRET,
        },
      );

      const isPublicTenant = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_TENANT_KEY,
        [context.getHandler(), context.getClass()],
      );

      //Validar tenant
      if (!isPublicTenant) {
        await this.validateTenant(request, payload);
      }

      request['user'] = payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateTenant(
    request: Request,
    payload: AccessTokenContent,
  ): Promise<void> {
    const tenant = getTenantFromRequest(request);

    if (tenant == DEFAULT_TENANT) {
      return;
    }

    // Validar que el tenant exista y pertenezca al usuario
    await this.companyService.isUserCompanyValid(tenant, payload.userId);

    // Si el token no tiene tenant asignar el tenant por defecto
    if (!payload.tenant) {
      payload.tenant = DEFAULT_TENANT;
    }

    // Validar que el tenant del token y el tenant del request sea el mismo
    if (tenant != payload.tenant) {
      const message = `Tenants does not match. Host tenant: ${tenant}, user tenant: ${payload.tenant}`;

      throw new UnauthorizedException({
        show: true,
        message,
      });
    }
  }
}
