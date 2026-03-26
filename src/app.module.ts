import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './core/config/env.validation';
import { PrismaModule } from './core/prisma/prisma.module';

@Module({
  imports: [
    // 1. Setup Config .env agar global
    ConfigModule.forRoot({
      isGlobal: true, // Membuat service Config bisa dipakai di semua module
      validate, // Pasang validasi yang kita buat tadi
    }),

    // 2. Setup Database
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
