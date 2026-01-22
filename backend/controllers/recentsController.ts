import { Response } from 'express';
import { AuthRequest } from '../lib/AuthRequest';
import {prisma} from '../lib/prisma'



export const getRecentsFiles = async (req:AuthRequest, res:Response) => {
    try{
        const {page, limit} = req.query;
        const pageNo = Number(page);
        const limitNo = Number(limit);
        const skip = (pageNo-1)*limitNo;
        const recentFiles = await prisma.file.findMany({
            orderBy:{
                updatedAt:'desc'
            },
            take:limitNo,
            skip:skip
        });

        const totalCount = await prisma.file.count();
        
     

        return res.status(200).json({files:recentFiles, hasMore:skip+recentFiles.length<totalCount});
    } catch(error:any){
        console.log("Failed to fetch recents files: ", error);
        return res.status(500).json({message:"Failed to fetch recents files"});
    }
}