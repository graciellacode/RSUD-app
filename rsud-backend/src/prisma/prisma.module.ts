import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Jadikan global agar tidak perlu import manual di modul lain
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }