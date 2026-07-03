import { Controller, Post, Body, Get, Patch, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DokterService } from './dokter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dokter')
export class DokterController {
    constructor(private readonly dokterService: DokterService) { }

    @Post()
    create(@Body() dto: any) {
        return this.dokterService.create(dto);
    }

    @Get()
    findAll() {
        return this.dokterService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.dokterService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.dokterService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.dokterService.remove(id);
    }
}
