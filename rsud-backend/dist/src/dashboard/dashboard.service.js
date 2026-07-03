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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalPasien, totalDokter, totalPendaftaran, totalRekamMedis, pendaftaranStatusGroup, recentPendaftaran,] = await Promise.all([
            this.prisma.pasien.count(),
            this.prisma.dokter.count(),
            this.prisma.pendaftaran.count(),
            this.prisma.rekamMedis.count(),
            this.prisma.pendaftaran.groupBy({
                by: ['status'],
                _count: {
                    id: true,
                },
            }),
            this.prisma.pendaftaran.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    pasien: {
                        select: {
                            nama: true,
                            nik: true,
                        },
                    },
                    jadwalPraktek: {
                        include: {
                            dokter: {
                                select: {
                                    nama: true,
                                },
                            },
                        },
                    },
                },
            }),
        ]);
        const statusCounts = {
            MENUNGGU: 0,
            SELESAI: 0,
            BATAL: 0,
        };
        pendaftaranStatusGroup.forEach((group) => {
            if (group.status in statusCounts) {
                statusCounts[group.status] = group._count.id;
            }
        });
        return {
            totalPasien,
            totalDokter,
            totalPendaftaran,
            totalRekamMedis,
            pendaftaranStatus: statusCounts,
            recentPendaftaran,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map