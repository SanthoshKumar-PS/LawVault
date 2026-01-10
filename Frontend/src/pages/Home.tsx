import { useRef, useState } from "react"
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

const FileManagerContent = () => {
  const [sideBarOpen,setSideBarOpen] = useState<boolean>(false);
  const [newItemModalOpen, setNewItemModalOpen] = useState<boolean>(false);
  const [manageUsersModalOpen, setManageUsersModalOpen] = useState<boolean>(false);
  const [moveModalOpen, setMoveModalOpen] = useState<boolean>(false);
  const [moveItemIds, setMoveItemIds] = useState<number[]>([]);
  const [moveItemNames, setMoveItemNames] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])


  // const {addFile, currentFolderId} = useFileManager();
  // const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // // Cleanup intervals on unmount
  // useEffect(() => {
  //   return () => {
  //     intervalsRef.current.forEach(interval => clearInterval(interval));
  //   };
  // }, []);
  
  const handleMoveClick = (ids:number[], names:string[]) => {
    setMoveItemIds(ids);
    setMoveItemNames(names);
    setMoveModalOpen(true);
  }

  const handleStartUpload = (files:File[]) => {
    const newUploadingFiles : UploadingFile[] = files.map(file=>({
      id:`upload-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
      file,
      progress:0,
      status:'uploading' 
    }))

    setUploadingFiles(prev=>[...prev,...newUploadingFiles]);

    newUploadingFiles.forEach(uploadFile => {
      // simulateUpload((uploadFile))
      console.log("Uploading file id: ",uploadFile.id)
    })
  }

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
    </div>
  )
}


const Home = () => {
  return (
      <FileManagerProvider>
        <FileManagerContent/>
      </FileManagerProvider>
  )
}

export default Home