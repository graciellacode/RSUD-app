import { Module } from '@nestjs/common';
import { RekamMedisService } from './rekam-medis.service';
import { RekamMedisController } from './rekam-medis.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RekamMedisService],
  controllers: [RekamMedisController],
})
export class RekamMedisModule {}
