import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Kita gunakan tipe string agar fleksibel sesuai isi kolom role ("ADMIN" / "PETUGAS") di DB kamu
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);