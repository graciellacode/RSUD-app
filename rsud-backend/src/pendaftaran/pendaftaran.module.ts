import { Module } from '@nestjs/common';
import { PendaftaranService } from './pendaftaran.service';
import { PendaftaranController } from './pendaftaran.controller';

@Module({
  providers: [PendaftaranService],
  controllers: [PendaftaranController]
})
export class PendaftaranModule {}
