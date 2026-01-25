import { Response } from 'express'
import { prisma } from '../lib/prisma';
import { getBreadcrumbs } from '../lib/getBreadcrumbs'
import { AuthRequest } from '../lib/AuthRequest';
export const getFilesAndFoldersById = async (req:AuthRequest, res:Response)=> {
    try {
        const {currentFolderId} = req.query;
        const currentFolderIdNo = currentFolderId? Number(currentFolderId) : null
        const foldersQuery = prisma.folder.findMany({
            where:{
                parentId:currentFolderIdNo
            },
            include:{
                _count:{
                    select:{
                        files:true,
                        children:true
                    }
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        });

        const filesQuery = prisma.file.findMany({
            where:{
                folderId:currentFolderIdNo
            },
            orderBy:{
                createdAt:'desc'
            }
        });

        const breadcrumbsQuery = getBreadcrumbs(currentFolderIdNo);

        const [folders, files, breadcrumbs] = await Promise.all([
            foldersQuery,
            filesQuery,
            breadcrumbsQuery
        ]) 

        console.log("Current Folder Id: ",currentFolderIdNo)
        console.log("Folders: ",folders)
        console.log("Files: ",files)
        console.log("BreadCrumbs: ",breadcrumbs)


        return res.status(200).json({
            message:'Success',
            folders,
            files,
            breadcrumbs

        })

    } catch (error:any) {
        console.log("Internal Server Error")
        return res.status(500).json({message:'Internal Server Error'})
    }
}


export const createNewFolder = async (req:AuthRequest, res:Response) => {
    try {
        const { folderName, parentId } = req.body;
        const parentIdNo = parentId? Number(parentId):null;

        const newFolder = await prisma.folder.create({
            data:{
                name: folderName,
                createdBy:req.user?.id!,
                parentId:parentIdNo
            },
            include:{
                _count:{
                    select:{
                        files:true,
                        children:true
                    }
                }
            },      
        })

        return res.status(200).json({message:'New Folder Created', newFolder});
    } catch (error:any) {
        console.log("Internal Server Error: ",error);
        return res.status(500).json({message:'Internal Server Error'})
    }
}

export const getRecentFoldersAndFiles = async (req:AuthRequest, res:Response) => {
    try {
        const files = await prisma.file.findMany({
            take:20,
            skip:0,
            orderBy:{
                createdAt: 'desc'
            }
        })
    } catch (error:any) {
        console.log("Error occured in getRecentFoldersAndFiles", error);
        return res.status(500).json({message:'Internal Server Error'});
        
    }
}

export const renameFileOrFolder = async (req:AuthRequest, res:Response) => {
    try {
        const {id, type, newName} = req.body;
        console.log("All details: ", id, type, newName)
        if(type==='file'){
            const updatedFile = await prisma.file.update({
                where:{id},
                data:{
                    name:newName
                }
            });
            console.log("Updated File: ", updatedFile);
            return res.status(200).json({ message: 'File renamed successfully', data: updatedFile });
        } else{
            const updatedFolder = await prisma.folder.update({
                where:{id},
                data:{
                    name:newName
                }
            });
            console.log("Updated Folder: ", updatedFolder)
            return res.status(200).json({ message: 'File renamed successfully', data: updatedFolder });
        }
    } catch (error:any) {
        console.log("Error occured in getRecentFoldersAndFiles", error);
        return res.status(500).json({message:'Internal Server Error'});
        
    }
}