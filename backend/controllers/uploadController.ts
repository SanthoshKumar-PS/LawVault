import {  Response } from "express";
import {prisma} from '../lib/prisma'
import { AuthRequest } from "../lib/AuthRequest";
import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, PutObjectCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import {s3} from '../lib/s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const BUCKET = process.env.AWS_S3_BUCKET_NAME;

export const getSinglePresignedUrl = async (req:AuthRequest, res:Response) => {
    try{
        const { fileName, contentType } = req.body;
        const s3Key = `uploads/${Date.now()}-${fileName}`;
        
        const command = new PutObjectCommand({
            Bucket:BUCKET,
            Key:s3Key,
            ContentType:contentType
        });

        const url = await getSignedUrl(s3, command, { expiresIn:3600 });
        return res.status(200).json({url, s3Key});
    } catch(error:any){
        console.log("Failed to generate single URL", error);
        return res.status(500).json({message:"Failed to generate single URL"});
    }
}

export const completeSingleUpload = async (req: AuthRequest, res: Response) => {
    try {
        const { s3Key, metadata } = req.body;
        
        const newFile = await prisma.file.create({
            data: {
                name: metadata.name,
                s3Key: s3Key,
                size: metadata.size,
                mimeType: metadata.mimeType,
                createdBy: metadata.userId ? Number(metadata.userId) : 1,
                folderId: metadata.folderId || null
            }
        });
        res.status(200).json({ message: 'File saved', newFile });
    } catch (error) {
        res.status(500).json({ message: 'DB Save failed' });
    }
};

export const abortUpload = async (req:AuthRequest, res:Response) => {
    try{
        const { fileName, uploadId } = req.body;

        const command = new AbortMultipartUploadCommand({
            Bucket:BUCKET,
            Key:fileName,
            UploadId:uploadId
        });

        await s3.send(command);
        res.status(200).json({ message: "Upload aborted and storage cleared" });
    } catch(error:any){
        console.log("Failed to abort", error)
        return res.status(500).json({ message: "Failed to abort" });
    }
}


export const initiateUpload = async (req:AuthRequest, res:Response) => {
    try {
        const { fileName, contentType } = req.body;
        const s3Key = `uploads/${Date.now()}-${fileName}`;

        const command = new CreateMultipartUploadCommand({
            Bucket:BUCKET,
            Key:s3Key,
            ContentType:contentType
        });

        const { UploadId } = await s3.send(command);

        return res.status(200).json({
            message:`Upload Initiated for ${fileName}`,
            uploadId: UploadId,
            s3Key 
        })

    } catch (error:any) {
        console.log("Error occured in authController");
        return res.status(500).json({message:"Failed to initiate upload"});
    }
}


export const getPreSignedUrl = async (req:AuthRequest, res:Response) => {
    try{
        const { fileName, uploadId, partNumber } = req.body;
        const command = new UploadPartCommand({
            Bucket:BUCKET,
            Key:fileName,
            UploadId:uploadId,
            PartNumber:partNumber
        });

        const url = await getSignedUrl(s3, command, {expiresIn:3600});

        return res.status(200).json({ url });
    } catch(error:any){
        console.log("Error occured in getPreSignedUrl", error);
        return res.status(500).json({message:'Error occured while generating presigned url.'})
    }
}


export const completeUpload = async (req:AuthRequest, res:Response) => {
    try{
        const { fileName, uploadId, parts, metadata } = req.body;
        console.log('Debug body: ', req.body)
        const command = new CompleteMultipartUploadCommand({
            Bucket:BUCKET,
            Key:fileName,
            UploadId:uploadId,
            MultipartUpload:{ Parts:parts }
        });

        const completed = await s3.send(command);

        const newFile = await prisma.file.create({
            data:{
                name:metadata.name,
                s3Key:fileName,
                size:metadata.size,
                mimeType:metadata.mimeType,
                createdBy:metadata.userId?Number(metadata.userId):1,
                folderId:metadata.folderId || null
            }
        });

        res.status(200).json({message:'File uploaded successfully', newFile})

    } catch(error:any){
        console.log("Error occured while marking complete upload");
        return res.status(500).json({message:'Failed to finalize upload'});
    }
}