import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    // Mendaftarkan JWT secara dinamis agar bisa membaca .env lewat ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Default expired 1 hari
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule], // Export jika module lain butuh men-generate token (login)
})
export class AuthModule {}
