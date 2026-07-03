import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async getDashboardStats() {
        const [
            totalPasien,
            totalDokter,
            totalPendaftaran,
            totalRekamMedis,
            pendaftaranStatusGroup,
            recentPendaftaran,
        ] = await Promise.all([
            this.prisma.pasien.count(),
            this.prisma.dokter.count(),
            this.prisma.pendaftaran.count(),
            this.prisma.rekamMedis.count(),
            this.prisma.pendaftaran.groupBy({
                by: ['status'],
                _count: {
                    id: true,
                },
            }),
            this.prisma.pendaftaran.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    pasien: {
                        select: {
                            nama: true,
                            nik: true,
                        },
                    },
                    jadwalPraktek: {
                        include: {
                            dokter: {
                                select: {
                                    nama: true,
                                },
                            },
                        },
                    },
                },
            }),
        ]);

        const statusCounts = {
            MENUNGGU: 0,
            SELESAI: 0,
            BATAL: 0,
        };

        pendaftaranStatusGroup.forEach((group) => {
            if (group.status in statusCounts) {
                statusCounts[group.status as keyof typeof statusCounts] = group._count.id;
            }
        });

        return {
            totalPasien,
            totalDokter,
            totalPendaftaran,
            totalRekamMedis,
            pendaftaranStatus: statusCounts,
            recentPendaftaran,
        };
    }
}
