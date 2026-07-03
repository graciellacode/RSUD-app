import { Module } from '@nestjs/common';
import { DokterService } from './dokter.service';
import { DokterController } from './dokter.controller';

@Module({
  providers: [DokterService],
  controllers: [DokterController]
})
export class DokterModule {}
