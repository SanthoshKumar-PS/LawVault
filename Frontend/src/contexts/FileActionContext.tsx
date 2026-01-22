import { createContext, useContext, useState, type ReactNode } from "react";
import type { UploadingFile } from "../components/uploads/UploadProgress";
import { useAuth } from "./AuthContext";
import { useS3Upload } from "../hooks/useS3Upload";
import { useFileManager } from "./FileManagerContext";
import type { MoveItemType } from "../types/TableTypes";
import api from "../lib/api";

type FileActionContextType = {
  uploadingFiles: UploadingFile[];
  handleStartUpload: (files: File[], folderId: number | null) => void;
  handleUploadComplete: (file: UploadingFile) => void;
  handleClearCompleted: () => void;
  moveModalOpen: boolean;
  setMoveModalOpen: (open: boolean) => void;
  moveItemIds: MoveItemType[];
  handleMoveClick: (items: MoveItemType[]) => void;
  handleFileOpen:(s3Key:string) => void;
  handleFileDownload:(s3Key: string, fileName:string) => void;
};

const FileActionContext = createContext<FileActionContextType | undefined>(undefined);

export const FileActionProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const {currentFolderId} = useFileManager()
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [moveItemIds, setMoveItemIds] = useState<MoveItemType[]>([]);

  const { uploadSingleFile } = useS3Upload(
    setUploadingFiles,
    currentUser ? currentUser.id : 1,
    currentFolderId??undefined
  );

  const handleStartUpload = (files: File[], folderId: number | null) => {
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    newUploadingFiles.forEach(uploadFile => {
      uploadSingleFile(uploadFile); // Pass folderId to hook if needed to add parent folder
    });
  };

  const handleMoveClick = (items: MoveItemType[]) => {
    setMoveItemIds(items);
    setMoveModalOpen(true);
  };

  const handleUploadComplete = (completedFile: UploadingFile) => {
    setUploadingFiles(prev =>
      prev.map(f => f.id === completedFile.id ? { ...f, progress: 100, status: 'completed' } : f)
    );
  };

  const handleFileOpen = async (s3Key:string) => {
    const { data } = await api.post('/getFileViewUrl',{
      s3Key
    });

    window.open(data.url,'_blank');
  }


  return (
    <FileActionContext.Provider value={{
      uploadingFiles,
      handleStartUpload,
      handleUploadComplete,
      handleClearCompleted: () => setUploadingFiles(prev => prev.filter(f => f.status !== 'completed')),
      moveModalOpen,
      setMoveModalOpen,
      moveItemIds,
      handleMoveClick,
      handleFileOpen,
      handleFileDownload
    }}>
      {children}
    </FileActionContext.Provider>
  );
};

export const useFileActions = () => {
  const context = useContext(FileActionContext);
  if (!context) throw new Error("useFileActions must be used within FileActionProvider");
  return context;
};