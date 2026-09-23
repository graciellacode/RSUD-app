import { Module } from '@nestjs/common';
import { JadwalService } from './jadwal.service';
import { JadwalController } from './jadwal.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [JadwalService, PrismaService],
  controllers: [JadwalController]
})
export class JadwalModule { }
