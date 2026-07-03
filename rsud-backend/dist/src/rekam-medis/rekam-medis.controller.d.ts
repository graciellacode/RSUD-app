import { RekamMedisService } from './rekam-medis.service';
export declare class RekamMedisController {
    private readonly service;
    constructor(service: RekamMedisService);
    create(dto: any): Promise<{
        pendaftaran: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        pendaftaranId: number;
        diagnosis: string;
        tindakan: string;
        resep: string | null;
        catatan: string | null;
    }>;
    findAll(): Promise<({
        pendaftaran: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        pendaftaranId: number;
        diagnosis: string;
        tindakan: string;
        resep: string | null;
        catatan: string | null;
    })[]>;
    findOne(id: number): Promise<{
        pendaftaran: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        pendaftaranId: number;
        diagnosis: string;
        tindakan: string;
        resep: string | null;
        catatan: string | null;
    }>;
    update(id: number, dto: any): Promise<{
        pendaftaran: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        pendaftaranId: number;
        diagnosis: string;
        tindakan: string;
        resep: string | null;
        catatan: string | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
