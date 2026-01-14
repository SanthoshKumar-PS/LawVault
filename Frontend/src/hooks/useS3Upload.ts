import api from "../lib/api";
import type { Dispatch, SetStateAction } from "react";
import type { UploadingFile } from "../components/uploads/UploadProgress";
import axios from "axios";

const CHUNK_SIZE = 5*1024*1024; //5MB

export const useS3Upload = (
    setUploadingFiles: Dispatch<SetStateAction<UploadingFile[]>>,
    userId:number,
    folderId?: number
) => {
    const uploadSingleFile = async (uploadingFile: UploadingFile) => {
        const { file, id } = uploadingFile;

    try {
        const initRes = await api.post('/initiateUpload', {
            fileName: file.name,
            contentType: file.type
        });
        const { uploadId, s3Key } = initRes.data;

        const totalParts = Math.ceil(file.size / CHUNK_SIZE);
        const completedParts = [];

        for (let i = 0; i < totalParts; i++) {
            const partNumber = i + 1;
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            //Getting Signed URL for this chunk
            const { data: { url } } = await api.post('/getPreSignedUrl', {
            fileName: s3Key,
            uploadId,
            partNumber
            });

            // Upload chunk with progress tracking
            const uploadRes = await axios.put(url, chunk, {
            onUploadProgress: (progressEvent) => {
                const uploadedBytes = start + (progressEvent.loaded);
                const percent = Math.round((uploadedBytes / file.size) * 100);
                
                setUploadingFiles(prev => prev.map(f => 
                f.id === id ? { ...f, progress: Math.min(percent, 99) } : f
                ));
            }
            });

            completedParts.push({ ETag: uploadRes.headers.etag, PartNumber: partNumber });
        }

        await api.post('/completeUpload', {
            fileName: s3Key,
            uploadId,
            parts: completedParts,
            metadata: {
            name: file.name,
            size: file.size,
            mimeType: file.type,
            userId,
            folderId
            }
        });

        setUploadingFiles(prev => prev.map(f => 
            f.id === id ? { ...f, progress: 100, status: 'completed' } : f
        ));

        } catch (error) {
        console.error("Upload Error:", error);
        setUploadingFiles(prev => prev.map(f => 
            f.id === id ? { ...f, status: 'cancelled' } : f
        ));
        }
    }

  return { uploadSingleFile };
}