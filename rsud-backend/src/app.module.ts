import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PasienModule } from './pasien/pasien.module';
import { DokterModule } from './dokter/dokter.module';
import { JadwalModule } from './jadwal/jadwal.module';
import { PendaftaranModule } from './pendaftaran/pendaftaran.module';
import { RekamMedisModule } from './rekam-medis/rekam-medis.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, AuthModule, PasienModule, DokterModule, JadwalModule, PendaftaranModule, RekamMedisModule, DashboardModule],
  controllers: [], // <--- Kosongkan saja karena AppController sudah dihapus
  providers: [],   // <--- Kosongkan saja karena AppService sudah dihapus
})
export class AppModule { }