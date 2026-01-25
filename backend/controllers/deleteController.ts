import { Response } from 'express';
import { AuthRequest } from '../lib/AuthRequest';
import {prisma} from '../lib/prisma'
import {getFilesandFolders} from '../utils/getFilesandFolders';
import { MoveItemType } from './moveController';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/s3';
const BUCKET = process.env.AWS_S3_BUCKET_NAME;

export const deleteFilesAndFolders = async (req:AuthRequest, res:Response) => {
    try{
        const itemsIds = req.body.itemsIds as any as MoveItemType[];
        
        if (!itemsIds || !Array.isArray(itemsIds)) {
            return res.status(400).json({ message: "Invalid or missing itemsIds" });
        }
        console.log("itemsIds: ",itemsIds)

        const {fileIds, folderIds} = getFilesandFolders(itemsIds);

        console.log("Recieved files and folders to delete: ",fileIds, folderIds);

        const result = await prisma.$transaction(async (tx) =>{
            const deleteFiles = await prisma.file.findMany({
                where:{
                    id: { in: fileIds },
                },
                select:{
                    s3Key: true
                }
            });

            if(deleteFiles.length===0) return {count:0}

            const deleteResult = await tx.file.deleteMany({
                where:{
                    id: { in:fileIds }
                }
            });

            const s3Keys = deleteFiles.map(file => ({Key:file.s3Key}));

            const command = new DeleteObjectsCommand({
                Bucket:BUCKET,
                Delete: { Objects: s3Keys }
            });

            const result = await s3.send(command);
            console.log("S3 Delete result: ", result)

            return deleteResult;
        })

        

        return res.status(200).json({message:'Successfully deleted', count:result.count});
    } catch(error:any){
        console.log("Failed to generate single URL", error);
        return res.status(500).json({message:"Failed to generate single URL"});
    }
}
