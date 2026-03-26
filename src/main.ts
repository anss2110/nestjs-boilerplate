import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Global Prefix & Versioning (Akan menghasilkan URL seperti /api/v1/...)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 2. Global Validation Pipe untuk DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Membuang payload asing yang tidak ada di DTO
      transform: true, // Otomatis mengubah tipe data (misal string '1' jadi number 1)
      forbidNonWhitelisted: true, // Melempar error jika ada payload siluman
    }),
  );

  // 3. Pasang Interceptor untuk format response sukses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 4. Pasang Filter untuk format response error
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Boilerplate is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
