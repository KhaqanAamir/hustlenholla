import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { USER_ROLE } from "@prisma/client";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles)
            return true

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role.includes(role))
    }
}