import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PendaftaranService {
    constructor(private prisma: PrismaService) { }

    async create(dto: any) {
        // 1. Validasi Kelengkapan Data
        if (!dto.pasienId || !dto.jadwalPraktekId || !dto.tanggalPeriksa || !dto.keluhan) {
            throw new BadRequestException('Harap lengkapi data pendaftaran!');
        }

        const pasien = await this.prisma.pasien.findUnique({ where: { id: dto.pasienId } });
        if (!pasien) throw new NotFoundException(`Pasien ID ${dto.pasienId} tidak ditemukan!`);

        const jadwal = await this.prisma.jadwalPraktek.findUnique({
            where: { id: dto.jadwalPraktekId },
            include: { dokter: true }
        });
        if (!jadwal) throw new NotFoundException(`Jadwal ID ${dto.jadwalPraktekId} tidak ditemukan!`);

        // 2. Cek Kuota
        const totalPendaftaran = await this.prisma.pendaftaran.count({
            where: {
                jadwalPraktekId: dto.jadwalPraktekId,
                status: { not: 'BATAL' },
            }
        });

        if (totalPendaftaran >= jadwal.kuota) {
            throw new BadRequestException(`Kuota hari ${jadwal.hari} sudah penuh! Silakan pilih jadwal lain.`);
        }

        // 3. Hitung Nomor Antrean
        const nomorAntrean = totalPendaftaran + 1;

        // 4. Simpan Pendaftaran
        return this.prisma.pendaftaran.create({
            data: {
                pasienId: dto.pasienId,
                jadwalPraktekId: dto.jadwalPraktekId,
                tanggalPeriksa: new Date(dto.tanggalPeriksa),
                noAntrean: nomorAntrean,
                status: 'MENUNGGU',
                keluhan: dto.keluhan,
            },
            include: {
                pasien: true,
                jadwalPraktek: {
                    include: { dokter: true }
                }
            }
        });
    }

    async findAll() {
        return this.prisma.pendaftaran.findMany({
            include: {
                pasien: true,
                jadwalPraktek: {
                    include: { dokter: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: number) {
        const pendaftaran = await this.prisma.pendaftaran.findUnique({
            where: { id },
            include: {
                pasien: true,
                jadwalPraktek: {
                    include: { dokter: true }
                }
            }
        });
        if (!pendaftaran) throw new NotFoundException('Data pendaftaran tidak ditemukan!');
        return pendaftaran;
    }

    async update(id: number, dto: any) {
        await this.findOne(id);
        return this.prisma.pendaftaran.update({
            where: { id },
            data: {
                ...dto,
                tanggalPeriksa: dto.tanggalPeriksa ? new Date(dto.tanggalPeriksa) : undefined,
            },
            include: {
                pasien: true,
                jadwalPraktek: {
                    include: { dokter: true }
                }
            }
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.pendaftaran.delete({ where: { id } });
        return { message: 'Data pendaftaran berhasil dihapus!' };
    }
}
