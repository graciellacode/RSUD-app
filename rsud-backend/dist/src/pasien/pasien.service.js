"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasienService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PasienService = class PasienService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const pasienExists = await this.prisma.pasien.findUnique({
            where: { nik: dto.nik },
        });
        if (pasienExists) {
            throw new common_1.BadRequestException('Pasien dengan NIK tersebut sudah terdaftar!');
        }
        return this.prisma.pasien.create({
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
    async findAll() {
        return this.prisma.pasien.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const pasien = await this.prisma.pasien.findUnique({ where: { id } });
        if (!pasien)
            throw new common_1.NotFoundException('Data pasien tidak ditemukan!');
        return pasien;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.pasien.update({
            where: { id },
            data: {
                ...dto,
                tanggalLahir: dto.tanggalLahir ? new Date(dto.tanggalLahir) : undefined,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.pasien.delete({ where: { id } });
        return { message: 'Data pasien berhasil dihapus!' };
    }
    async findOrCreate(dto) {
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
};
exports.PasienService = PasienService;
exports.PasienService = PasienService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PasienService);
//# sourceMappingURL=pasien.service.js.map