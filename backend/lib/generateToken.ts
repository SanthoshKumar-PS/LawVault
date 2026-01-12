import jwt from 'jsonwebtoken';
import {User, Permissions} from '@prisma/client'
const JWT_SECRET = process.env.JWT_SECRET || 'LAW9876'

type UserWithPermission = User & {
    permissions: Permissions | null;
}
export const generateToken=(user:UserWithPermission) => {
    const token = jwt.sign(
        {
            id:user.id,
            email:user.email,
            role:user.role,
            permission:user.permissions
        },
        JWT_SECRET
    );

    return token
} 