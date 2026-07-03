import { PrismaService } from '../prisma/prisma.service';
export declare class PasienService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        id: number;
        nik: string;
        nama: string;
        tanggalLahir: Date;
        jenisKelamin: string;
        alamat: string;
        noHp: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        nik: string;
        nama: string;
        tanggalLahir: Date;
        jenisKelamin: string;
        alamat: string;
        noHp: string;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        nik: string;
        nama: string;
        tanggalLahir: Date;
        jenisKelamin: string;
        alamat: string;
        noHp: string;
        createdAt: Date;
    }>;
    update(id: number, dto: any): Promise<{
        id: number;
        nik: string;
        nama: string;
        tanggalLahir: Date;
        jenisKelamin: string;
        alamat: string;
        noHp: string;
        createdAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findOrCreate(dto: any): Promise<{
        id: number;
        nik: string;
        nama: string;
        tanggalLahir: Date;
        jenisKelamin: string;
        alamat: string;
        noHp: string;
        createdAt: Date;
    }>;
}
