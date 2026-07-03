import { Controller, Post, Body, Get, Patch, Delete, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common'; import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard'; // <--- Import RolesGuard baru
import { Roles } from './roles.decorator'; // <--- Import decorator Roles baru

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: any) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: any) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
        return {
            message: 'Kamu berhasil mengakses data rahasia!',
            user: req.user,
        };
    }

    // --- ENDPOINT PROTEKSI BERDASARKAN ROLE ---

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN') // <--- Mengunci endpoint khusus ADMIN
    @Get('admin-only')
    getAdminData() {
        return {
            message: 'Selamat datang Admin! Anda berhak mengelola data sistem utama.',
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('users')
    getAllUsers() {
        return this.authService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch('users/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.authService.updateUser(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete('users/:id')
    removeUser(@Param('id', ParseIntPipe) id: number) {
        return this.authService.removeUser(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('PETUGAS') // <--- Mengunci endpoint khusus PETUGAS
    @Get('petugas-only')
    getPetugasData() {
        return {
            message: 'Selamat datang Petugas! Anda berhak menginput data operasional.',
        };
    }

}