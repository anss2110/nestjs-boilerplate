import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // 3. Pasang Global Interceptor untuk format response sukses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 4. Pasang Global Filter untuk format response error
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. Pasang Swagger
  const config = new DocumentBuilder()
    .setTitle('Ikigai API Documentation')
    .setDescription(
      'Dokumentasi resmi untuk backend boilerplate & microservices Ikigai.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan token JWT Anda di sini',
        in: 'header',
      },
      'JWT-auth', // Ini adalah nama referensi untuk security auth
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger akan bisa diakses di http://localhost:3000/docs
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Menyimpan token di browser walau di-refresh
    },
  });

  // 6. Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';
  await app.listen(port, host);
  console.log(`🚀 Boilerplate is running on: http://${host}:${port}/api/v1`);
  console.log(`📚 Swagger Docs is available at: http://${host}:${port}/docs`);
}
bootstrap();
