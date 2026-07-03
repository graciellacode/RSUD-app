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
exports.PendaftaranService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PendaftaranService = class PendaftaranService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        if (!dto.pasienId || !dto.jadwalPraktekId || !dto.tanggalPeriksa || !dto.keluhan) {
            throw new common_1.BadRequestException('Harap lengkapi data pendaftaran!');
        }
        const pasien = await this.prisma.pasien.findUnique({ where: { id: dto.pasienId } });
        if (!pasien)
            throw new common_1.NotFoundException(`Pasien ID ${dto.pasienId} tidak ditemukan!`);
        const jadwal = await this.prisma.jadwalPraktek.findUnique({
            where: { id: dto.jadwalPraktekId },
            include: { dokter: true }
        });
        if (!jadwal)
            throw new common_1.NotFoundException(`Jadwal ID ${dto.jadwalPraktekId} tidak ditemukan!`);
        const totalPendaftaran = await this.prisma.pendaftaran.count({
            where: {
                jadwalPraktekId: dto.jadwalPraktekId,
                status: { not: 'BATAL' },
            }
        });
        if (totalPendaftaran >= jadwal.kuota) {
            throw new common_1.BadRequestException(`Kuota hari ${jadwal.hari} sudah penuh! Silakan pilih jadwal lain.`);
        }
        const nomorAntrean = totalPendaftaran + 1;
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
    async findOne(id) {
        const pendaftaran = await this.prisma.pendaftaran.findUnique({
            where: { id },
            include: {
                pasien: true,
                jadwalPraktek: {
                    include: { dokter: true }
                }
            }
        });
        if (!pendaftaran)
            throw new common_1.NotFoundException('Data pendaftaran tidak ditemukan!');
        return pendaftaran;
    }
    async update(id, dto) {
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
    async remove(id) {
        await this.findOne(id);
        await this.prisma.pendaftaran.delete({ where: { id } });
        return { message: 'Data pendaftaran berhasil dihapus!' };
    }
};
exports.PendaftaranService = PendaftaranService;
exports.PendaftaranService = PendaftaranService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PendaftaranService);
//# sourceMappingURL=pendaftaran.service.js.map