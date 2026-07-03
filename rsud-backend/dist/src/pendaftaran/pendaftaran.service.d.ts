import { PrismaService } from '../prisma/prisma.service';
export declare class PendaftaranService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        pasien: {
            id: number;
            nik: string;
            nama: string;
            tanggalLahir: Date;
            jenisKelamin: string;
            alamat: string;
            noHp: string;
            createdAt: Date;
        };
        jadwalPraktek: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        jadwalPraktekId: number;
        tanggalPeriksa: Date;
        noAntrean: number;
        status: string;
        keluhan: string;
        pasienId: number;
    }>;
    findAll(): Promise<({
        pasien: {
            id: number;
            nik: string;
            nama: string;
            tanggalLahir: Date;
            jenisKelamin: string;
            alamat: string;
            noHp: string;
            createdAt: Date;
        };
        jadwalPraktek: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        jadwalPraktekId: number;
        tanggalPeriksa: Date;
        noAntrean: number;
        status: string;
        keluhan: string;
        pasienId: number;
    })[]>;
    findOne(id: number): Promise<{
        pasien: {
            id: number;
            nik: string;
            nama: string;
            tanggalLahir: Date;
            jenisKelamin: string;
            alamat: string;
            noHp: string;
            createdAt: Date;
        };
        jadwalPraktek: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        jadwalPraktekId: number;
        tanggalPeriksa: Date;
        noAntrean: number;
        status: string;
        keluhan: string;
        pasienId: number;
    }>;
    update(id: number, dto: any): Promise<{
        pasien: {
            id: number;
            nik: string;
            nama: string;
            tanggalLahir: Date;
            jenisKelamin: string;
            alamat: string;
            noHp: string;
            createdAt: Date;
        };
        jadwalPraktek: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        jadwalPraktekId: number;
        tanggalPeriksa: Date;
        noAntrean: number;
        status: string;
        keluhan: string;
        pasienId: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
