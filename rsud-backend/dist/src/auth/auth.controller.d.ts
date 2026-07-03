import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: any): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    }>;
    login(dto: any): Promise<{
        message: string;
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    getProfile(req: any): {
        message: string;
        user: any;
    };
    getAdminData(): {
        message: string;
    };
    getAllUsers(): Promise<{
        id: number;
        email: string;
        name: string;
        role: string;
    }[]>;
    updateUser(id: number, dto: any): Promise<{
        id: number;
        email: string;
        name: string;
        role: string;
    }>;
    removeUser(id: number): Promise<{
        message: string;
    }>;
    getPetugasData(): {
        message: string;
    };
}
