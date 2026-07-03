import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DokterService {
    constructor(private prisma: PrismaService) { }

    async create(dto: any) {
        const dokterExists = await this.prisma.dokter.findUnique({
            where: { noIzinPraktek: dto.noIzinPraktek },
        });

        if (dokterExists) {
            throw new BadRequestException('Dokter dengan No Izin Praktek tersebut sudah terdaftar!');
        }

        return this.prisma.dokter.create({ data: dto });
    }

    async findAll() {
        return this.prisma.dokter.findMany({ orderBy: { nama: 'asc' } });
    }

    async findOne(id: number) {
        const dokter = await this.prisma.dokter.findUnique({ where: { id } });
        if (!dokter) throw new NotFoundException('Data dokter tidak ditemukan!');
        return dokter;
    }

    async update(id: number, dto: any) {
        await this.findOne(id);
        return this.prisma.dokter.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.dokter.delete({ where: { id } });
        return { message: 'Data dokter berhasil dihapus!' };
    }
}
