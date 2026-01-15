import {S3Client} from '@aws-sdk/client-s3';
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Agent } from "https";
export const s3 = new S3Client({
    region:process.env.AWS_REGION!,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
});