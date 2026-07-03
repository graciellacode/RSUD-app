import { PrismaService } from '../prisma/prisma.service';
export declare class JadwalService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        kuota: number;
        dokterId: number;
    }>;
    findAll(): Promise<({
        dokter: {
            nama: string;
            spesialisasi: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        kuota: number;
        dokterId: number;
    })[]>;
    findOne(id: number): Promise<{
        dokter: {
            id: number;
            nama: string;
            noHp: string;
            createdAt: Date;
            noIzinPraktek: string;
            spesialisasi: string;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        kuota: number;
        dokterId: number;
    }>;
    update(id: number, dto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        kuota: number;
        dokterId: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
