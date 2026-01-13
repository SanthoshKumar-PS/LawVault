import jwt from 'jsonwebtoken';
import {NextFunction, Response} from 'express'
import {AuthRequest} from '../lib/AuthRequest'
import { User } from '@prisma/client';
export const authenticate = (req:AuthRequest,res:Response,next:NextFunction) => {
    const authHeader = req.headers.authorization
    console.log("Auth Header: ",authHeader);
    const token = authHeader?.split(' ')[1]
    if(!token){
        return res.status(401).json({message:'Token Missing'})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET!)
        req.user = decoded as User;
        console.log("User: ",decoded)
        next();

    } catch(error:any){
        return res.status(401).json({message:'Invalid or expired token'})
    }


}