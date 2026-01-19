import { Response } from 'express';
import { AuthRequest } from '../lib/AuthRequest';
import {prisma} from '../lib/prisma'
import { getBreadcrumbs } from '../lib/getBreadcrumbs';


export const getFoldersUnderFolderId = async (req:AuthRequest, res:Response) => {
    try{
        const { navigatedFolderId, itemsIds } = req.query;
        console.log("Req query: ", req.query);
        const navigatedFolderIdNo = navigatedFolderId ? Number(navigatedFolderId) : null;
        const excludedIds: number[] = Array.isArray(itemsIds)
            ? itemsIds.map(Number)
            : typeof itemsIds === "string"
                ? itemsIds.split(",").map(Number)
                : [];

        console.log("Excluded IDs: ",excludedIds)
        
        const currentFolders = await prisma.folder.findMany({
            select:{
                id:true,
                name:true,
                _count:{
                    select:{
                        files:true,
                        children:true
                    }
                }
            },
            where:{
                parentId:navigatedFolderIdNo,
                id:{
                    notIn: excludedIds
                }
            },

        });

        const currentBreadcrumbs = await getBreadcrumbs(navigatedFolderIdNo)

        console.log("Current Folders: ",currentFolders)
     

        return res.status(200).json({currentFolders, currentBreadcrumbs});
    } catch(error:any){
        console.log("Failed to generate single URL", error);
        return res.status(500).json({message:"Failed to generate single URL"});
    }
}


export const moveFoldersToTargetId = async (req:AuthRequest, res:Response) => {
    try{
        const { targetFolderId, itemsIds } = req.query;
        console.log("Req query: ", req.query);
        const targetFolderIdNo = targetFolderId ? Number(targetFolderId) : null;
        
        const includedIds: number[] = Array.isArray(itemsIds)
            ? itemsIds.map(Number)
            : typeof itemsIds === "string"
                ? itemsIds.split(",").map(Number)
                : [];
        
        const currentFolders = await prisma.folder.updateMany({
            where:{
                id:{
                    in: includedIds
                }
            },
            data: {
                parentId:targetFolderIdNo
            }

        });
     

        return res.status(200).json({message:'Successfully moved'});
    } catch(error:any){
        console.log("Failed to generate single URL", error);
        return res.status(500).json({message:"Failed to generate single URL"});
    }
}
