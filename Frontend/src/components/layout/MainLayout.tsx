import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import Header from "../../components/layout/Header";
import AppSideBar from "../../components/layout/AppSideBar";
import NewItemModal from "../../components/modals/NewItemModal";
import MoveToModal from "../../components/modals/MoveToModal";
import UploadProgress from "../../components/uploads/UploadProgress";
import { Button } from "../../components/ui/button";

import { useFileManager } from "../../contexts/FileManagerContext";
import { useFileActions } from "../../contexts/FileActionContext";

const MainLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [manageUsersModalOpen, setManageUsersModalOpen] = useState(false);

  const { currentFolderId } = useFileManager();
  const { 
    uploadingFiles, handleStartUpload, handleUploadComplete, 
    handleClearCompleted, handleMoveClick, moveModalOpen, 
    setMoveModalOpen, moveItemIds, moveItemNames 
  } = useFileActions();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={() => setSideBarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sideBarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSideBarOpen(false)}
                className="fixed inset-0 bg-foreground/20 backdrop-blur-xs z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                className="fixed left-0 top-0 bottom-0 z-40 lg:hidden"
              >
                <div className="relative h-full">
                  <Button variant='default' size='icon' onClick={() => setSideBarOpen(false)} className="absolute right-4 top-2 z-10">
                    <X className="h-5 w-5" />
                  </Button>
                  <AppSideBar
                    onNewClick={() => { setNewItemModalOpen(true); setSideBarOpen(false); }}
                    onManageUsersClick={() => { setManageUsersModalOpen(true); setSideBarOpen(false); }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSideBar
            onNewClick={() => setNewItemModalOpen(true)}
            onManageUsersClick={() => setManageUsersModalOpen(true)}
          />
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet /> 
        </main>
      </div>

      <NewItemModal
        open={newItemModalOpen}
        onOpenChange={setNewItemModalOpen}
        onStartUpload={(files) => handleStartUpload(files, currentFolderId)}
      />

      <MoveToModal
        open={moveModalOpen}
        onOpenChange={setMoveModalOpen}
        itemsIds={moveItemIds}
        itemsNames={moveItemNames}
      />

      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <UploadProgress
            uploads={uploadingFiles}
            onUploadComplete={handleUploadComplete}
            onClearCompleted={handleClearCompleted}
            onCancelUpload={(id) => console.log("Cancel", id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};



export default MainLayout;