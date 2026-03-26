import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Tambahkan tanda seru (!) untuk meyakinkan TypeScript bahwa nilainya tidak undefined
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Fungsi ini otomatis terpanggil jika token valid
  // Payload adalah isi dari token yang sudah di-decode
  async validate(payload: any) {
    // Contoh: Mencari user di database berdasarkan ID dari payload token
    // Sesuaikan 'id' atau 'storeId' dengan struktur token Anda saat ini
    const user = await this.prisma?.user?.findUnique({
      where: { id: payload.sub || payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }

    // Apapun yang di-return di sini akan masuk ke object `request.user`
    return user;
  }
}
