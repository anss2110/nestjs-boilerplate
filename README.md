# 🚀 NestJS Enterprise Boilerplate

Boilerplate backend NestJS berskala _Enterprise_ yang dirancang untuk performa tinggi, standarisasi kode, dan kemudahan pengembangan. Boilerplate ini menggunakan arsitektur modular yang memisahkan infrastruktur inti (_Core_), utilitas bersama (_Common_), dan fitur bisnis (_Modules_).

Dibangun menggunakan **NestJS**, **Fastify**, dan **Prisma ORM**.

## ✨ Fitur Utama

- **⚡ Performa Tinggi:** Menggunakan `Fastify` sebagai _engine_ HTTP di bawah kap (jauh lebih cepat dari Express/Hapi).
- **🛡️ Type-Safe & Tervalidasi:** Validasi ketat pada _environment variables_ (`.env`) dan _payload request_ menggunakan `class-validator`.
- **🗄️ ORM Modern:** Integrasi penuh dengan **Prisma ORM** untuk interaksi database yang aman dan cepat.
- **🔐 Sistem Autentikasi:** Sudah dilengkapi dengan modul Auth berbasis **JWT & Passport**.
- **📦 Format Response Terpusat:** Output API dan _Error Handling_ diseragamkan secara global (menggantikan kebiasaan `@hapi/boom`).

---

## 📋 Persyaratan Sistem

Sebelum memulai, pastikan sistem Anda memiliki:

- **Node.js**: Minimal versi 18.x atau 20.x (LTS direkomendasikan).
- **PNPM**: Versi 8.x atau terbaru (`npm install -g pnpm`).
- **Database**: PostgreSQL / MySQL (sesuai konfigurasi Prisma Anda).
- **Docker**: (Opsional) Jika ingin menjalankan database secara lokal menggunakan container.

---

## 🛠️ Instalasi & Persiapan

**1. Clone atau Fork Repository ini**
Jadikan repositori ini sebagai _template_ untuk proyek baru Anda (misal: `marketplace-api`).

**2. Install Dependencies**
Gunakan PNPM untuk menginstal semua _library_:

```bash
pnpm install
```

**3. Setup Environment Variables**
Duplikat file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Buka file `.env` dan isi variabel yang diwajibkan (Aplikasi akan **gagal menyala** jika variabel ini kosong atau salah tipe data):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="rahasia-super-kuat-anda"
```

**4. Persiapan Database (Prisma)**
Lakukan migrasi skema database Anda dan _generate_ Prisma Client:

```bash
# Generate tipe data Prisma
pnpm dlx prisma generate

# Sinkronisasi skema ke database (untuk development)
pnpm dlx prisma db push
# ATAU jika menggunakan file migrasi:
# pnpm dlx prisma migrate dev
```

---

## 🚀 Menjalankan Aplikasi

```bash
# Mode Development (Auto-reload)
pnpm run start:dev

# Mode Production (Build & Run)
pnpm run build
pnpm run start:prod
```

Aplikasi akan berjalan di: `http://localhost:3000/api/v1`

---

## 📂 Struktur Direktori

Proyek ini menggunakan pola 3 Pilar (Common, Core, Modules) agar kode tidak menjadi _spaghetti_:

```text
src/
├── common/           # 🛠️ PILAR 1: SHARED UTILS (Bisa dipakai di mana saja)
│   ├── decorators/   # Custom decorators (cth: @CurrentUser)
│   ├── filters/      # Global Exception Filter (Format error JSON standar)
│   ├── guards/       # Proteksi endpoint (cth: JwtAuthGuard)
│   └── interceptors/ # Format Response standar (statusCode, message, data)
│
├── core/             # ⚙️ PILAR 2: INFRASTRUKTUR (Hanya diatur sekali)
│   ├── config/       # Validasi file .env
│   └── prisma/       # Koneksi ke database (PrismaService global)
│
├── modules/          # 📦 PILAR 3: DOMAIN BISNIS (Fitur aplikasi)
│   └── auth/         # Logika Autentikasi dan JWT Strategy
│
├── app.module.ts     # Root modul yang menggabungkan semuanya
└── main.ts           # Entry point aplikasi (Setup Fastify & Global Pipes)
```

---

## 📖 Cara Penggunaan (How-to-Use)

Berikut adalah panduan bagi _developer_ yang menggunakan boilerplate ini untuk membangun fitur baru:

### 1. Membuat Modul Baru

Gunakan Nest CLI (via PNPM) untuk mempercepat pembuatan fitur baru. Misalnya membuat fitur `Products`:

```bash
pnpm dlx nest generate module modules/products
pnpm dlx nest generate controller modules/products
pnpm dlx nest generate service modules/products
```

### 2. Memproteksi Endpoint (Auth)

Untuk membuat endpoint hanya bisa diakses oleh _user_ yang sudah login, gunakan `@UseGuards(JwtAuthGuard)`.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  @Get('my-products')
  @UseGuards(JwtAuthGuard) // Wajib bawa token Bearer
  getMyProducts(@CurrentUser() user: any) {
    // Parameter 'user' otomatis berisi data dari token JWT yang valid
    return {
      message: 'Berhasil mengambil data',
      data: { userId: user.id, items: [] },
    };
  }
}
```

### 3. Response API Otomatis

Anda tidak perlu lagi menulis struktur manual seperti `return { statusCode: 200, message: "OK", data: {...} }`. Cukup _return_ datanya, dan **Global Interceptor** akan otomatis membungkusnya.

### 4. Menangani Error

Gunakan bawaan exception NestJS. **Global Exception Filter** akan menangkapnya dan menyeragamkan format _output_ JSON agar sama persis di seluruh sistem.

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Di dalam service/controller:
if (!product) {
  throw new NotFoundException('Produk tidak ditemukan di database');
}
if (stock < 0) {
  throw new BadRequestException('Stok tidak boleh minus');
}
```

---
