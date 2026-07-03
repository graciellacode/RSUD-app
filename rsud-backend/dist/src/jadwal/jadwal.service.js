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
exports.JadwalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JadwalService = class JadwalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const dokter = await this.prisma.dokter.findUnique({ where: { id: dto.dokterId } });
        if (!dokter)
            throw new common_1.BadRequestException(`Dokter dengan ID ${dto.dokterId} tidak ditemukan!`);
        return this.prisma.jadwalPraktek.create({ data: dto });
    }
    async findAll() {
        return this.prisma.jadwalPraktek.findMany({
            orderBy: { hari: 'asc' },
            include: { dokter: { select: { nama: true, spesialisasi: true } } }
        });
    }
    async findOne(id) {
        const jadwal = await this.prisma.jadwalPraktek.findUnique({
            where: { id },
            include: { dokter: true }
        });
        if (!jadwal)
            throw new common_1.NotFoundException('Jadwal tidak ditemukan!');
        return jadwal;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.jadwalPraktek.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.jadwalPraktek.delete({ where: { id } });
        return { message: 'Jadwal berhasil dihapus!' };
    }
};
exports.JadwalService = JadwalService;
exports.JadwalService = JadwalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JadwalService);
//# sourceMappingURL=jadwal.service.js.map