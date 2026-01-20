import { Response } from 'express';
import { AuthRequest } from '../lib/AuthRequest';
import {prisma} from '../lib/prisma'
import { getBreadcrumbs } from '../lib/getBreadcrumbs';

interface MoveItemType {
    id:number,
    type:'file' | 'folder'
}

export const getFoldersUnderFolderId = async (req:AuthRequest, res:Response) => {
    try{
        const { navigatedFolderId } = req.query;
        console.log("Req query: ", req.query);
        const navigatedFolderIdNo = navigatedFolderId ? Number(navigatedFolderId) : null;
        const itemsIds = req.query.itemsIds as any as MoveItemType[];
        
        if (!itemsIds || !Array.isArray(itemsIds)) {
            return res.status(400).json({ message: "Invalid or missing itemsIds" });
        }
        const excludedFolderIds:number[] = itemsIds
            .filter((item:MoveItemType)=>item.type==='folder')
            .map(item => Number(item.id));


        console.log("Excluded IDs: ",excludedFolderIds)
        
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
                    notIn: excludedFolderIds
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
        const { targetFolderId } = req.query;
        console.log("Req query: ", req.query);
        const targetFolderIdNo = targetFolderId ? Number(targetFolderId) : null;
        
        const itemsIds = req.query.itemsIds as any as MoveItemType[];
        
        if (!itemsIds || !Array.isArray(itemsIds)) {
            return res.status(400).json({ message: "Invalid or missing itemsIds" });
        }
        console.log("itemsIds: ",itemsIds)
        const folderIds:number[] = itemsIds
            .filter((item:MoveItemType)=>item.type==='folder')
            .map(item => Number(item.id));

        const fileIds:number[] = itemsIds
            .filter((item:MoveItemType)=>item.type==='file')
            .map(item => Number(item.id));

        console.log("Recieved files and folders: ",fileIds, folderIds)

        const currentFolders = await prisma.folder.updateMany({
            where:{
                id:{
                    in: folderIds
                }
            },
            data: {
                parentId:targetFolderIdNo
            }

        });
        const currentFiles = await prisma.file.updateMany({
            where:{
                id:{
                    in: fileIds
                }
            },
            data: {
                folderId:targetFolderIdNo
            }
        });
     

        return res.status(200).json({message:'Successfully moved'});
    } catch(error:any){
        console.log("Failed to generate single URL", error);
        return res.status(500).json({message:"Failed to generate single URL"});
    }
}
