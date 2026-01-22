import { Permissions } from "@prisma/client"
import { NextFunction, Response } from "express"
import { prisma } from '../lib/prisma'
import { AuthRequest } from "../lib/AuthRequest"
export const requireAdminPermission = () => {
    return async (req:AuthRequest,res:Response, next:NextFunction)=>{
        const userRole = req.user?.role;

        if(userRole!=='ADMIN'){
            return res.status(403).json({message:'Admin Permission denied'})
        }

        next()
    }
}