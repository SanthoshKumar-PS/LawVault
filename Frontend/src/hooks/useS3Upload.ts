import api from "../lib/api";
import axios from "axios";
import { type Dispatch, type SetStateAction, useRef } from "react";
import type { UploadingFile } from "../components/uploads/UploadProgress";
import type { FileItem } from "@/types/TableTypes";
import { handleApiError } from "@/lib/handleApiError";

const CHUNK_SIZE = 5 * 1024 * 1024; 
const MULTIPART_THRESHOLD = 10 * 1024 * 1024;

export const useS3Upload = (
    setUploadingFiles: Dispatch<SetStateAction<UploadingFile[]>>,
    userId: number,
    setFiles:Dispatch<SetStateAction<FileItem[]>>,
    folderId?: number,
) => {
    const lastUpdateRef = useRef<number>(0);

    const updateUI = (fileId: string, progress: number, force = false) => {
        const now = Date.now();
        if (force || now - lastUpdateRef.current > 500) {
            setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress } : f));
            lastUpdateRef.current = now;
        }
    };

    const uploadSingleFile = async (uploadingFile: UploadingFile) => {
        const { file, id } = uploadingFile;

        try {
            if (file.size < MULTIPART_THRESHOLD) {
                const { data: { url, s3Key } } = await api.post('/getSinglePresignedUrl', {
                    fileName: file.name,
                    contentType: file.type
                });

                await axios.put(url, file, {
                    headers: { 
                        'Content-Type': file.type,
                        'x-amz-content-sha256': 'UNSIGNED-PAYLOAD' 
                    },
                    onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded / file.size) * 100);
                        updateUI(id, Math.min(percent, 99));
                    }
                });

                const completeRes = await api.post('/completeSingleUpload', {
                    s3Key,
                    metadata: { name: file.name, size: file.size, mimeType: file.type, userId, folderId }
                });
                setFiles(prev=> [completeRes.data.newFile,...prev])

            } 
            else {
                const initRes = await api.post('/initiateUpload', {
                    fileName: file.name,
                    contentType: file.type
                });
                const { uploadId, s3Key } = initRes.data;

                const totalParts = Math.ceil(file.size / CHUNK_SIZE);
                const completedParts: { ETag: string; PartNumber: number }[] = [];
                const partProgress: Record<number, number> = {}; 

                for (let partIdx = 0; partIdx < totalParts; partIdx++) {
                    const partNumber = partIdx + 1;
                    const start = partIdx * CHUNK_SIZE;
                    const end = Math.min(start + CHUNK_SIZE, file.size);
                    const chunk = file.slice(start, end);

                    const { data: { url } } = await api.post('/getPreSignedUrl', {
                        fileName: s3Key, 
                        uploadId, 
                        partNumber
                    });

                    const res = await axios.put(url, chunk, {
                        headers: { 
                            'Content-Type': file.type,
                            'x-amz-content-sha256': 'UNSIGNED-PAYLOAD'
                        },
                        onUploadProgress: (e) => {
                            partProgress[partNumber] = e.loaded;
                            const totalUploaded = Object.values(partProgress).reduce((a, b) => a + b, 0);
                            const percent = Math.round((totalUploaded / file.size) * 100);
                            updateUI(id, Math.min(percent, 99));
                        }
                    });

                    completedParts.push({
                        ETag: res.headers.etag.replace(/"/g, ''),
                        PartNumber: partNumber
                    });
                }

                const completedRes = await api.post('/completeUpload', {
                    fileName: s3Key,
                    uploadId,
                    parts: completedParts,
                    metadata: { name: file.name, size: file.size, mimeType: file.type, userId, folderId }
                });
                setFiles(prev=> [completedRes.data.newFile,...prev])

                console.log("Completed res: ",completedRes)
            }

            updateUI(id, 100, true);
            setUploadingFiles(prev => prev.map(f => 
                f.id === id ? { ...f, status: 'completed', progress: 100 } : f
            ));

        } catch (error) {
            console.log("Error occurred in : addFolder ",error);
            handleApiError(error); 
            setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'cancelled' } : f));
        }
    };

    return { uploadSingleFile };
}