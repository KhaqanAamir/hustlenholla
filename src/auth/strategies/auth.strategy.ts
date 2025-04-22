import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaClient, User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {
    private prisma: PrismaClient

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })

        this.prisma = new PrismaClient();
    }

    async validate(payload: any) {
        const { id } = payload;
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        if (user)
            delete user.password

        return user
    }
}