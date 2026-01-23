import { AuthRequest } from '../lib/AuthRequest';
import { Response } from 'express';
import { prisma } from '../lib/prisma'

export const getUserWithPermissions = async (req:AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include:{
                permissions:true
            }
        })
        return res.status(200).json({message:'Success', users})
        
    } catch (error:any) {
        console.log("Error occured in getUserWithPermissions: ", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
} 

export const updateUserPermissions = async (req:AuthRequest, res: Response) => {
    try {
        const {permissionDraft} = req.body;
        if(!permissionDraft){
            console.log("Missing permissionDraft parameters to update ")
            return res.status(400).json({message:'Mission required paramater'})
        }

        const response = await prisma.permissions.update({
            where:{
                userId:permissionDraft.userId
            },
            data:{
                view: permissionDraft.view,
                upload: permissionDraft.upload,
                download: permissionDraft.download,
                delete: permissionDraft.delete,
                create_folder: permissionDraft.create_folder,
                edit_folder: permissionDraft.edit_folder,
                delete_folder: permissionDraft.delete_folder,
                move: permissionDraft.move
            }
        })
    
        return res.status(200).json({message:'Success'})
        
    } catch (error:any) {
        console.log("Error occured in updateUserPermissions: ", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
} 

export const getUserprofile = async (req:AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(404).json({message:'User Not Found'});
        }

        const foldersCount = await prisma.folder.count({
            where:{
                createdBy:user.id
            }
        });

        const filesCount = await prisma.file.count({
            where:{
                createdBy:user.id
            }
        });
    
        return res.status(200).json({message:'Success', filesCount, foldersCount})
        
    } catch (error:any) {
        console.log("Error occured in updateUserPermissions: ", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
} 