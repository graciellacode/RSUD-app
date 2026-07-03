import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalPasien: number;
        totalDokter: number;
        totalPendaftaran: number;
        totalRekamMedis: number;
        pendaftaranStatus: {
            MENUNGGU: number;
            SELESAI: number;
            BATAL: number;
        };
        recentPendaftaran: ({
            pasien: {
                nik: string;
                nama: string;
            };
            jadwalPraktek: {
                dokter: {
                    nama: string;
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
        })[];
    }>;
}
