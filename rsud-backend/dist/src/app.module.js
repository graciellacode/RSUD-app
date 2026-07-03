"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const pasien_module_1 = require("./pasien/pasien.module");
const dokter_module_1 = require("./dokter/dokter.module");
const jadwal_module_1 = require("./jadwal/jadwal.module");
const pendaftaran_module_1 = require("./pendaftaran/pendaftaran.module");
const rekam_medis_module_1 = require("./rekam-medis/rekam-medis.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, pasien_module_1.PasienModule, dokter_module_1.DokterModule, jadwal_module_1.JadwalModule, pendaftaran_module_1.PendaftaranModule, rekam_medis_module_1.RekamMedisModule, dashboard_module_1.DashboardModule],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map