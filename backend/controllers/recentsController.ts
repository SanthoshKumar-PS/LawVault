import { Response } from 'express';
import { AuthRequest } from '../lib/AuthRequest';
import {prisma} from '../lib/prisma'



export const getRecentsFiles = async (req:AuthRequest, res:Response) => {
    try{
        const recentFiles = await prisma.file.findMany({
            orderBy:{
                createdAt:'desc'
            },
            take:30,
            skip:0
        });
        
     

        return res.status(200).json({files:recentFiles});
    } catch(error:any){
        console.log("Failed to fetch recents files: ", error);
        return res.status(500).json({message:"Failed to fetch recents files"});
    }
}