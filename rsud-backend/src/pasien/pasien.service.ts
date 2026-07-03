import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PasienService {
    constructor(private prisma: PrismaService) { }

    // 1. Tambah Pasien Baru
    async create(dto: any) {
        const pasienExists = await this.prisma.pasien.findUnique({
            where: { nik: dto.nik },
        });

        if (pasienExists) {
            throw new BadRequestException('Pasien dengan NIK tersebut sudah terdaftar!');
        }

        return this.prisma.pasien.create({
            data: {
                nik: dto.nik,
                nama: dto.nama,
                tanggalLahir: new Date(dto.tanggalLahir), // Memastikan format DateTime
                jenisKelamin: dto.jenisKelamin,
                alamat: dto.alamat,
                noHp: dto.noHp,
            },
        });
    }

    // 2. Ambil Semua Data Pasien
    async findAll() {
        return this.prisma.pasien.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    // 3. Ambil Satu Pasien Berdasarkan ID
    async findOne(id: number) {
        const pasien = await this.prisma.pasien.findUnique({ where: { id } });
        if (!pasien) throw new NotFoundException('Data pasien tidak ditemukan!');
        return pasien;
    }

    // 4. Update Data Pasien
    async update(id: number, dto: any) {
        await this.findOne(id); // Validasi dulu apakah pasien ada
        return this.prisma.pasien.update({
            where: { id },
            data: {
                ...dto,
                tanggalLahir: dto.tanggalLahir ? new Date(dto.tanggalLahir) : undefined,
            },
        });
    }

    // 5. Hapus Pasien
    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.pasien.delete({ where: { id } });
        return { message: 'Data pasien berhasil dihapus!' };
    }

    async findOrCreate(dto: any) {
        let pasien = await this.prisma.pasien.findUnique({ where: { nik: dto.nik } });

        if (!pasien) {
            pasien = await this.prisma.pasien.create({
                data: {
                    nik: dto.nik,
                    nama: dto.nama,
                    tanggalLahir: new Date(dto.tanggalLahir),
                    jenisKelamin: dto.jenisKelamin,
                    alamat: dto.alamat,
                    noHp: dto.noHp,
                },
            });
        }

        return pasien;
    }
}