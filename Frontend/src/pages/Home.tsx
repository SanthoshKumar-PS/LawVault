import { useEffect, useRef, useState } from "react"
import Header from "../components/layout/Header"
import { FileManagerProvider, useFileManager } from "../contexts/FileManagerContext";
import type { UploadingFile } from "../components/uploads/UploadProgress";
import { AnimatePresence, motion} from "framer-motion";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import AppSideBar from "../components/layout/AppSideBar";
import Toolbar from "../components/files/Toolbar";
import FileGrid from "../components/files/FileGrid";
import NewItemModal from "../components/modals/NewItemModal";
import MoveToModal from "../components/modals/MoveToModal";
import { interval } from "date-fns";
import UploadProgress from "../components/uploads/UploadProgress";
import { useAuth } from "../contexts/AuthContext";
import { useS3Upload } from "../hooks/useS3Upload";

const Home = () => {
  return (
      <FileManagerProvider>
        <FileManagerContent/>
      </FileManagerProvider>
  )
}

export default Home;


const FileManagerContent = () => {
  const [sideBarOpen,setSideBarOpen] = useState<boolean>(false);
  const [newItemModalOpen, setNewItemModalOpen] = useState<boolean>(false);
  const [manageUsersModalOpen, setManageUsersModalOpen] = useState<boolean>(false);
  const [moveModalOpen, setMoveModalOpen] = useState<boolean>(false);
  const [moveItemIds, setMoveItemIds] = useState<number[]>([]);
  const [moveItemNames, setMoveItemNames] = useState<string[]>([]);

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  

  const {  currentFolderId } = useFileManager();
  const {currentUser} = useAuth()

  // S3 uplaod hook
  const { uploadSingleFile } = useS3Upload(
    setUploadingFiles,
    currentUser? currentUser.id : 1,
    currentFolderId??undefined
  );


  
  const handleMoveClick = (ids:number[], names:string[]) => {
    setMoveItemIds(ids);
    setMoveItemNames(names);
    setMoveModalOpen(true);
  }

  // const handleStartUpload = (files:File[]) => {
  //   const newUploadingFiles : UploadingFile[] = files.map(file=>({
  //     id:`upload-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
  //     file,
  //     progress:0,
  //     status:'uploading' 
  //   }))

  //   setUploadingFiles(prev=>[...prev,...newUploadingFiles]);

  //   newUploadingFiles.forEach(uploadFile => {
  //     simulateUpload((uploadFile))
  //     console.log("Uploading file id: ",uploadFile.id)
  //   })
  // }

  const handleStartUpload = (files:File[]) => {
    const newUploadingFiles : UploadingFile[] = files.map(file=>({
      id:`upload-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
      file,
      progress:0,
      status:'uploading' 
    }))

    setUploadingFiles(prev=>[...prev,...newUploadingFiles]);

    newUploadingFiles.forEach(uploadFile => {
      uploadSingleFile(uploadFile)
      console.log("Uploading file id: ",uploadFile.id)
    })
  }

  // const simulateUpload = (uploadFile: UploadingFile) => {
  //   // Simulate 2 minute upload (120 seconds)
  //   const totalDuration = 120000;
  //   const updateInterval = 500;
  //   const totalUpdates = totalDuration / updateInterval;
  //   const progressIncrement = 100 / totalUpdates;
    
  //   let currentProgress = 0;

  //   const interval = setInterval(() => {
  //     currentProgress += progressIncrement;
  //     const jitter = (Math.random() - 0.5) * 0.5;
  //     const newProgress = Math.min(100, currentProgress + jitter);

  //     setUploadingFiles(prev => 
  //       prev.map(f => 
  //         f.id === uploadFile.id 
  //           ? { ...f, progress: newProgress }
  //           : f
  //       )
  //     );

  //     if (currentProgress >= 100) {
  //       clearInterval(interval);
  //       intervalsRef.current.delete(uploadFile.id);
        
  //       // Mark as completed
  //       setUploadingFiles(prev => 
  //         prev.map(f => 
  //           f.id === uploadFile.id 
  //             ? { ...f, progress: 100, status: 'completed' }
  //             : f
  //         )
  //       );

  //       // Add file to the file manager
  //       const extension = uploadFile.file.name.split('.').pop()?.toLowerCase() || '';
  //       let type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other' = 'other';
        
  //       if (['pdf', 'doc', 'docx', 'txt', 'pptx', 'xlsx'].includes(extension)) type = 'document';
  //       else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) type = 'image';
  //       else if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) type = 'video';
  //       else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) type = 'audio';
  //       else if (['zip', 'rar', '7z', 'tar'].includes(extension)) type = 'archive';
                
  //       addFile({
  //           id: Date.now(), 
  //           name: uploadFile.file.name,
  //           size: uploadFile.file.size,
  //           s3Key: 'pending...', 
  //           mimeType: uploadFile.file.type,
  //           createdBy: 5,
  //           folderId: currentFolderId,
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //         });
  //     }
  //   }, updateInterval);

  //   intervalsRef.current.set(uploadFile.id, interval);
  // };

  const handleUploadComplete = (completedFile : UploadingFile)=>{
    setUploadingFiles(prev =>
      prev.map(f =>
        f.id===completedFile.id
        ? {...f,progress:100,status:'completed'}
        :f
      )
    )
  }

  const handleClearCompleted = () => {
    setUploadingFiles(prev=> prev.filter(f => f.status !== 'completed'))
  }

  const handleCancelUpload = (uploadId:string) => {
    console.log("Cancel upload was called");
    // const interval = intervalsRef.current.get(uploadId);
    // if(interval){
    //   clearInterval(interval);
    //   intervalsRef.current.delete(uploadId)
    // }

    // setUploadingFiles(prev => prev.filter(f  => f.id !== uploadId))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick = {()=>setSideBarOpen(true)}/>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sideBarOpen && (
            <>
              <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                onClick={()=>setSideBarOpen(false)}
                className="fixed inset-0 bg-foreground/20 backdrop-blur-xs z-40 lg:hidden"
              />
              <motion.div
                initial={{x:'-100%'}}
                animate={{x:0}}
                exit={{x:'-100%'}}
                transition={{type:'spring', damping:25, stiffness:200}}
                className="fixed left-0 top-0 bottom-0 z-40 lg:hidden"
              >
                <div className="relative h-full">
                  <Button
                    variant='default'
                    size='icon'
                    onClick={()=>setSideBarOpen(false)}
                    className="absolute right-4 top-2 z-10"
                  >
                    <X className="h-5 w-5"/>
                  </Button>


                  <AppSideBar
                    onNewClick={()=>{
                      setNewItemModalOpen(true);
                      setSideBarOpen(false);
                    }}
                    onManageUsersClick={()=>{
                      setManageUsersModalOpen(true);
                      setSideBarOpen(false);
                    }}
                  />

                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSideBar
            onNewClick={()=>setNewItemModalOpen(true)}
            onManageUsersClick={()=>setManageUsersModalOpen(true)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.3}}
          >
            <Toolbar onMoveClick={handleMoveClick}/>
            <FileGrid onMoveClick={handleMoveClick}/>

          </motion.div>

        </main>

      </div>

      {/* Modals */}
      <NewItemModal
        open={newItemModalOpen}
        onOpenChange={setNewItemModalOpen}
        onStartUpload={handleStartUpload}
      />
      
      {/* Move To Modal */}
      <MoveToModal
        open={moveModalOpen}
        onOpenChange={setMoveModalOpen}
        itemsIds={moveItemIds}
        itemsNames={moveItemNames}
      />

      <AnimatePresence>
        {uploadingFiles.length>0 && (
          <UploadProgress
            uploads = {uploadingFiles}
            onUploadComplete = {handleUploadComplete}
            onClearCompleted = {handleClearCompleted}
            onCancelUpload = {handleCancelUpload}
          />
        )}
      </AnimatePresence>
    </div>
  )
}




