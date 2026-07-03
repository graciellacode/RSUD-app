import { JadwalService } from './jadwal.service';
export declare class JadwalController {
    private readonly jadwalService;
    constructor(jadwalService: JadwalService);
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
