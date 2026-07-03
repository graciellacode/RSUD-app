"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasienModule = void 0;
const common_1 = require("@nestjs/common");
const pasien_service_1 = require("./pasien.service");
const pasien_controller_1 = require("./pasien.controller");
let PasienModule = class PasienModule {
};
exports.PasienModule = PasienModule;
exports.PasienModule = PasienModule = __decorate([
    (0, common_1.Module)({
        providers: [pasien_service_1.PasienService],
        controllers: [pasien_controller_1.PasienController]
    })
], PasienModule);
//# sourceMappingURL=pasien.module.js.map