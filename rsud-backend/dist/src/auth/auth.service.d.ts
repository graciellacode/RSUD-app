import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: any): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    }>;
    login(dto: any): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        name: string;
        role: string;
    }[]>;
    updateUser(id: number, dto: any): Promise<{
        id: number;
        email: string;
        name: string;
        role: string;
    }>;
    removeUser(id: number): Promise<{
        message: string;
    }>;
}
