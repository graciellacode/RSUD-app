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
exports.DokterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DokterService = class DokterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const dokterExists = await this.prisma.dokter.findUnique({
            where: { noIzinPraktek: dto.noIzinPraktek },
        });
        if (dokterExists) {
            throw new common_1.BadRequestException('Dokter dengan No Izin Praktek tersebut sudah terdaftar!');
        }
        return this.prisma.dokter.create({ data: dto });
    }
    async findAll() {
        return this.prisma.dokter.findMany({ orderBy: { nama: 'asc' } });
    }
    async findOne(id) {
        const dokter = await this.prisma.dokter.findUnique({ where: { id } });
        if (!dokter)
            throw new common_1.NotFoundException('Data dokter tidak ditemukan!');
        return dokter;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.dokter.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.dokter.delete({ where: { id } });
        return { message: 'Data dokter berhasil dihapus!' };
    }
};
exports.DokterService = DokterService;
exports.DokterService = DokterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DokterService);
//# sourceMappingURL=dokter.service.js.map