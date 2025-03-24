import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        return user;
    }

    async login(user: any): Promise<{ access_token: string }> {
        const payload = { userId: user.id, email: user.email, name: user.name, last_name: user.last_name, roles: user.roles  };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
