import { DokterService } from './dokter.service';
export declare class DokterController {
    private readonly dokterService;
    constructor(dokterService: DokterService);
    create(dto: any): Promise<{
        id: number;
        nama: string;
        noHp: string;
        createdAt: Date;
        noIzinPraktek: string;
        spesialisasi: string;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        nama: string;
        noHp: string;
        createdAt: Date;
        noIzinPraktek: string;
        spesialisasi: string;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        nama: string;
        noHp: string;
        createdAt: Date;
        noIzinPraktek: string;
        spesialisasi: string;
        updatedAt: Date;
    }>;
    update(id: number, dto: any): Promise<{
        id: number;
        nama: string;
        noHp: string;
        createdAt: Date;
        noIzinPraktek: string;
        spesialisasi: string;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
