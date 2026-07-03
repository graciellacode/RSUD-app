import { Controller, Post, Body, Get, Patch, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JadwalService } from './jadwal.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('jadwal')
export class JadwalController {
    constructor(private readonly jadwalService: JadwalService) { }

    @Public()
    @Get()
    findAll() {
        return this.jadwalService.findAll();
    }

    @Post()
    create(@Body() dto: any) {
        return this.jadwalService.create(dto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.jadwalService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.jadwalService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.jadwalService.remove(id);
    }
}