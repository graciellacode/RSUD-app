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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasienController = void 0;
const common_1 = require("@nestjs/common");
const pasien_service_1 = require("./pasien.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let PasienController = class PasienController {
    pasienService;
    constructor(pasienService) {
        this.pasienService = pasienService;
    }
    findOrCreate(dto) {
        return this.pasienService.findOrCreate(dto);
    }
    create(dto) {
        return this.pasienService.create(dto);
    }
    findAll() {
        return this.pasienService.findAll();
    }
    findOne(id) {
        return this.pasienService.findOne(id);
    }
    update(id, dto) {
        return this.pasienService.update(id, dto);
    }
    remove(id) {
        return this.pasienService.remove(id);
    }
};
exports.PasienController = PasienController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('cari-atau-buat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PasienController.prototype, "findOrCreate", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PasienController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PasienController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PasienController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PasienController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PasienController.prototype, "remove", null);
exports.PasienController = PasienController = __decorate([
    (0, common_1.Controller)('pasien'),
    __metadata("design:paramtypes", [pasien_service_1.PasienService])
], PasienController);
//# sourceMappingURL=pasien.controller.js.map