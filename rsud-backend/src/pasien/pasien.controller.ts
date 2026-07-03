import { Controller, Post, Body, Get, Patch, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PasienService } from './pasien.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('pasien')
export class PasienController {
  constructor(private readonly pasienService: PasienService) { }

  @Public()
  @Post('cari-atau-buat')
  findOrCreate(@Body() dto: any) {
    return this.pasienService.findOrCreate(dto);
  }

  @Post()
  create(@Body() dto: any) {
    return this.pasienService.create(dto);
  }

  @Get()
  findAll() {
    return this.pasienService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pasienService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.pasienService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pasienService.remove(id);
  }
}


