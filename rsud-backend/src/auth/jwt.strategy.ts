import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Membaca token dari header 'Authorization: Bearer <TOKEN>'
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'rahasia_super_aman_jangan_diumbar',
        });
    }

    async validate(payload: { id: number; email: string; role: string }) {
        // Cari user di database berdasarkan ID yang ada di dalam token payload (id)
        const user = await this.prisma.user.findUnique({
            where: { id: payload.id },
        });

        if (!user) {
            throw new UnauthorizedException('Token tidak valid atau user tidak ditemukan');
        }

        // Apapun yang di-return di sini akan otomatis dimasukkan ke dalam object 'req.user'
        return { id: user.id, email: user.email, role: user.role, name: user.name };
    }
}