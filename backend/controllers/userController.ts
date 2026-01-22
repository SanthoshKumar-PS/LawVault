import { AuthRequest } from '../lib/AuthRequest';
import { Response } from 'express';
import { prisma } from '../lib/prisma'

export const getUserWithPermissions = async (req:AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include:{
                permissions:true
            }
        })
        return res.status(200).json({message:'Success', users})
        
    } catch (error:any) {
        console.log("Error occured in getUserWithPermissions: ", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
} 