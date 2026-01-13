import { Permissions } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { prisma } from '../lib/prisma'
export const requirePermission = (permission:keyof Permissions) => {
    async (req:Request,res:Response, next:NextFunction)=>{
        const userId = req.user?.id;

        const userPermissions = await prisma.permissions.findUnique({
            where:{
                userId:userId
            }
        });

        if(!userPermissions || !userPermissions[permission]){
            return res.status(403).json({message:'Permission denied'})
        }

        next()
    }
}