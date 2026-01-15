import {S3Client} from '@aws-sdk/client-s3';
import { NodeHttpHandler } from "@smithy/node-http-handler";
export const s3 = new S3Client({
    region:process.env.AWS_REGION!,
    // runtime: 'node',
requestHandler: new NodeHttpHandler({
        connectionTimeout: 5000,
        requestTimeout: 0, 
    }),
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
});