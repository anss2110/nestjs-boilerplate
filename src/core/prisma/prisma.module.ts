import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export agar service-nya bisa disuntikkan (inject) ke file lain
})
export class PrismaModule {}
