import {  Response } from "express";
import { AuthRequest } from "../lib/AuthRequest";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {s3} from '../lib/s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const BUCKET = process.env.AWS_S3_BUCKET_NAME;

export const getFileViewUrl = async (req:AuthRequest, res:Response) => {
    try{
        const { s3Key } = req.body;

        const command = new GetObjectCommand({
            Bucket:BUCKET,
            Key:s3Key
        })
        const url = await getSignedUrl(s3, command, { expiresIn:3600 });
        return res.status(200).json({url, s3Key});
    } catch(error:any){
        console.log("Failed to fetch file URL", error);
        return res.status(500).json({message:"Failed to fetch file URL"});
    }
}