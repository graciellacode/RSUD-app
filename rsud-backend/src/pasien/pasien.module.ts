import { Module } from '@nestjs/common';
import { PasienService } from './pasien.service';
import { PasienController } from './pasien.controller';

@Module({
  providers: [PasienService],
  controllers: [PasienController]
})
export class PasienModule {}
