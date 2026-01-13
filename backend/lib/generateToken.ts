import jwt from 'jsonwebtoken';
import {User, Permissions} from '@prisma/client'
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET){
    throw new Error('JWT_SECRET must be provided in .env')
}

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
        JWT_SECRET,
        {expiresIn:'7d'}
    );

    return token
} 