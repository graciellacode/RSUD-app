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
exports.RekamMedisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RekamMedisService = class RekamMedisService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        if (!dto.pendaftaranId || !dto.diagnosis || !dto.tindakan) {
            throw new common_1.BadRequestException('pendaftaranId, diagnosis, dan tindakan wajib diisi!');
        }
        const pendaftaran = await this.prisma.pendaftaran.findUnique({
            where: { id: dto.pendaftaranId },
        });
        if (!pendaftaran) {
            throw new common_1.NotFoundException(`Pendaftaran ID ${dto.pendaftaranId} tidak ditemukan!`);
        }
        const existing = await this.prisma.rekamMedis.findUnique({
            where: { pendaftaranId: dto.pendaftaranId },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Rekam medis untuk pendaftaran ID ${dto.pendaftaranId} sudah ada!`);
        }
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
    async findOne(id) {
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
        if (!rekamMedis)
            throw new common_1.NotFoundException('Rekam medis tidak ditemukan!');
        return rekamMedis;
    }
    async update(id, dto) {
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
    async remove(id) {
        await this.findOne(id);
        await this.prisma.rekamMedis.delete({ where: { id } });
        return { message: 'Rekam medis berhasil dihapus!' };
    }
};
exports.RekamMedisService = RekamMedisService;
exports.RekamMedisService = RekamMedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RekamMedisService);
//# sourceMappingURL=rekam-medis.service.js.map