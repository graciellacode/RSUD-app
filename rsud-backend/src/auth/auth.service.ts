import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common'; import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // 1. LOGIKA REGISTER (Membuat User Admin/Petugas)
    async register(dto: any) {
        // Cek apakah email sudah terdaftar
        const userExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (userExists) {
            throw new BadRequestException('Email sudah terdaftar!');
        }

        // Hash password menggunakan bcrypt agar aman di database
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Simpan ke database MySQL via Prisma
        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                role: dto.role, // "ADMIN" atau "PETUGAS"
            },
        });

        // Hilangkan password dari response demi keamanan
        const { password: _, ...userWithoutPassword } = newUser;
        return {
            message: 'User berhasil didaftarkan!',
            user: userWithoutPassword,
        };
    }

    // 2. LOGIKA LOGIN (Validasi & Pembuatan Token)
    async login(dto: any) {
        // Cari user berdasarkan email
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Email atau password salah!');
        }

        // Bandingkan password yang diketik dengan yang ada di database
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah!');
        }

        // Jika sukses, buatkan payload token JWT
        const payload = { id: user.id, email: user.email, role: user.role };

        return {
            message: 'Login berhasil!',
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async findAll() {
        const users = await this.prisma.user.findMany({ orderBy: { name: 'asc' } });
        return users.map(({ password, ...rest }) => rest);
    }

    async updateUser(id: number, dto: any) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User tidak ditemukan!');

        const data: any = { ...dto };
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
        } else {
            delete data.password;
        }

        const updated = await this.prisma.user.update({ where: { id }, data });
        const { password: _, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }

    async removeUser(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User tidak ditemukan!');
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User berhasil dihapus!' };
    }
}