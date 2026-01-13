import {  Response } from "express";
import {prisma} from '../lib/prisma'
import { generateToken } from '../lib/generateToken'
import { AuthRequest } from "../lib/AuthRequest";
export const authController = async (req:AuthRequest, res:Response) => {
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({
            where:{
                email:email
            },
            include:{
                permissions:true
            }
        });
        if(!user){
            return res.status(401).json({message:"Invalid email or password"})
        }
        if(password!==user.password){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const token = generateToken(user)

        return res.status(200).json({
            message:"Login successfull",
            token:token,
            user:user
        })

        console.log(req.body)
        console.log("Success")
        return res.status(200).json({message:"Success"})
    } catch (error:any) {
        console.log("Error occured in authController");
        return res.status(500).json({message:"Internal Server Error"});
    }
}