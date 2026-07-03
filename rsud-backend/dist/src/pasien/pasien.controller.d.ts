import { PasienService } from './pasien.service';
export declare class PasienController {
    private readonly pasienService;
    constructor(pasienService: PasienService);
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
}
