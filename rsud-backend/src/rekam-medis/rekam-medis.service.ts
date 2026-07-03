import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RekamMedisService {
    constructor(private prisma: PrismaService) { }

    async create(dto: any) {
        if (!dto.pendaftaranId || !dto.diagnosis || !dto.tindakan) {
            throw new BadRequestException('pendaftaranId, diagnosis, dan tindakan wajib diisi!');
        }

        // Cek pendaftaran ada
        const pendaftaran = await this.prisma.pendaftaran.findUnique({
            where: { id: dto.pendaftaranId },
        });
        if (!pendaftaran) {
            throw new NotFoundException(`Pendaftaran ID ${dto.pendaftaranId} tidak ditemukan!`);
        }

        // Cek belum ada rekam medis untuk pendaftaran ini
        const existing = await this.prisma.rekamMedis.findUnique({
            where: { pendaftaranId: dto.pendaftaranId },
        });
        if (existing) {
            throw new BadRequestException(`Rekam medis untuk pendaftaran ID ${dto.pendaftaranId} sudah ada!`);
        }

        // Buat rekam medis & update status pendaftaran jadi SELESAI dalam satu transaksi
        const [rekamMedis] = await this.prisma.$transaction([
            this.prisma.rekamMedis.create({
                data: {
                    pendaftaranId: dto.pendaftaranId,
                    diagnosis: dto.diagnosis,
                    tindakan: dto.tindakan,
                    resep: dto.resep ?? null,
                    catatan: dto.catatan ?? null,
                },
                include: {
                    pendaftaran: {
                        include: {
                            pasien: true,
                            jadwalPraktek: { include: { dokter: true } },
                        },
                    },
                },
            }),
            this.prisma.pendaftaran.update({
                where: { id: dto.pendaftaranId },
                data: { status: 'SELESAI' },
            }),
        ]);

        return rekamMedis;
    }

    async findAll() {
        return this.prisma.rekamMedis.findMany({
            include: {
                pendaftaran: {
                    include: {
                        pasien: true,
                        jadwalPraktek: { include: { dokter: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const rekamMedis = await this.prisma.rekamMedis.findUnique({
            where: { id },
            include: {
                pendaftaran: {
                    include: {
                        pasien: true,
                        jadwalPraktek: { include: { dokter: true } },
                    },
                },
            },
        });
        if (!rekamMedis) throw new NotFoundException('Rekam medis tidak ditemukan!');
        return rekamMedis;
    }

    async update(id: number, dto: any) {
        await this.findOne(id);
        return this.prisma.rekamMedis.update({
            where: { id },
            data: {
                diagnosis: dto.diagnosis,
                tindakan: dto.tindakan,
                resep: dto.resep,
                catatan: dto.catatan,
            },
            include: {
                pendaftaran: {
                    include: {
                        pasien: true,
                        jadwalPraktek: { include: { dokter: true } },
                    },
                },
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.rekamMedis.delete({ where: { id } });
        return { message: 'Rekam medis berhasil dihapus!' };
    }
}
