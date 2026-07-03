import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Ambil list role yang diizinkan untuk endpoint ini
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Jika tidak ada batasan role, biarkan lolos (cukup validasi JWT saja)
        if (!requiredRoles) {
            return true;
        }

        // 2. Ambil data user dari request (yang diisi otomatis oleh JwtStrategy setelah lolos JwtAuthGuard)
        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role) {
            throw new ForbiddenException('Akses ditolak. Informasi user tidak ditemukan.');
        }

        // 3. Validasi apakah role user saat ini masuk dalam daftar role yang dibutuhkan
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('Anda tidak memiliki hak akses untuk halaman ini!');
        }

        return true;
    }
}