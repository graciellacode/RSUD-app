import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JadwalService {
    constructor(private prisma: PrismaService) { }

    async create(dto: any) {
        const dokter = await this.prisma.dokter.findUnique({ where: { id: dto.dokterId } });
        if (!dokter) throw new BadRequestException(`Dokter dengan ID ${dto.dokterId} tidak ditemukan!`);

        return this.prisma.jadwalPraktek.create({ data: dto });
    }

    async findAll() {
        return this.prisma.jadwalPraktek.findMany({
            orderBy: { hari: 'asc' },
            include: { dokter: { select: { nama: true, spesialisasi: true } } } // Tampilkan info dokter
        });
    }

    async findOne(id: number) {
        const jadwal = await this.prisma.jadwalPraktek.findUnique({
            where: { id },
            include: { dokter: true }
        });
        if (!jadwal) throw new NotFoundException('Jadwal tidak ditemukan!');
        return jadwal;
    }

    async update(id: number, dto: any) {
        await this.findOne(id);
        return this.prisma.jadwalPraktek.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.jadwalPraktek.delete({ where: { id } });
        return { message: 'Jadwal berhasil dihapus!' };
    }
}
