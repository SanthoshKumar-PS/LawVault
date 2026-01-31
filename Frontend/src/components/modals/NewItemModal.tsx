import React, { useState } from 'react'
import { useFileManager } from '../../contexts/FileManagerContext';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader } from '../ui/dialog';
import { motion,AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { File, FileText, FolderPlus, Image, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
type NewItemModalProps = {
    open: boolean;
    onOpenChange: (open:boolean) => void;
    onStartUpload?: (files:File[]) => void;
}
type ModalView = 'select' | 'upload' | 'folder'
const NewItemModal = ({open, onOpenChange, onStartUpload}:NewItemModalProps) => {
    const [view, setView] = useState<ModalView>('select');
    const [folderName, setFolderName] = useState<string>('');
    const [dragActive, setDragActive] = useState<boolean>(false);
    const { addFolder } = useFileManager();
    const { hasPermission } = useAuth();

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(()=>{
            setView('select')
            setFolderName('')
        },200);
    }

    const handleCreateFolder = () => {
        if(folderName.trim()){
            addFolder(folderName.trim());
            handleClose();
        }
    }

    const handleFileUpload = (files:FileList|null) => {
        if(!files || files.length===0) return;
        if(files.length>3){
            toast.info('You cannot upload more than 3 files in parallel.')
            return
        }

        onStartUpload?.(Array.from(files));
        handleClose();
    }

    const handleDrag = (e:React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(e.type==='dragenter' || e.type==='dragover'){
            setDragActive(true);
        } else if(e.type === 'dragleave'){
            setDragActive(false);
        }
    }

    const handleDrop = (e:React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileUpload(e.dataTransfer.files)
    }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
            <DialogHeader>
                <DialogTitle>
                    {view==='select' && 'Create New'}
                    {view==='upload' && 'Upload Files'}
                    {view==='folder' && 'New Folder'}
                </DialogTitle>
                <DialogDescription>
                    {view==='select' && 'Choose what you want to create'}
                    {view==='upload' && 'Drag and drop files or click to browse'}
                    {view==='folder' && 'Enter a name for your new folder'}
                </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode='wait'>
                {view==='select' && (
                    <motion.div
                        key='select'
                        initial={{opacity:0, y:10}}
                        animate={{opacity:1, y:0}}
                        exit={{opacity:0, y:-10}}
                        className='grid grid-cols-2 gap-3 mt-4'
                    >
                        {hasPermission('upload') && (
                            <Button
                                variant='outline'
                                className='h-24 flex-col gap-2 group'
                                onClick={()=>setView('upload')}
                            >
                                <Upload className='h-6 w-6 text-primary group-hover:text-white'/>
                                <span>Upload Files</span>
                            </Button>
                        )}
                        {hasPermission('create_folder') && (
                            <Button
                                variant='outline'
                                className='h-24 flex-col gap-2 group'
                                onClick={()=>setView('folder')}
                            >
                                <FolderPlus className='h-6 w-6 text-primary group-hover:text-white'/>
                                <span>New Folder</span>
                            </Button>
                        )}
                    </motion.div>
                )}

                {view==='upload' && (
                    <motion.div
                        key='upload'
                        initial={{opacity:0, y:10}}
                        animate={{opacity:1, y:0}}
                        exit={{opacity:0, y:-10}}
                        className='mt-4'
                    >
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrag={handleDrag}
                            className={cn(
                                'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                                dragActive?'border-primary bg-primary/5':'border-border hover:border-primary/50'
                            )}
                        >
                            <div className='flex justify-center gap-2 mb-4'>
                                <File className='h-8 w-8 text-primary'/>
                                <Image className='h-8 w-8 text-success'/>
                                <FileText className='h-8 w-8 text-warning'/>
                            </div>
                            <p className='text-sm font-medium mb-1'>
                                Drag and drop files here
                            </p>
                            <p className='text-xs font-muted-foreground mb-4 '>
                                or click to browse your files
                            </p>
                            <input
                                type='file'
                                multiple
                                onChange={(e)=>handleFileUpload(e.target.files)}
                                className='hidden'
                                id='file-upload'
                            />
                            <label htmlFor="file-upload">
                                <Button variant='default' asChild>
                                    <span className='cursor-pointer'>Browse Files</span>
                                </Button>
                            </label>
                        </div>
                            <div className='flex justify-between mt-4'>
                                <Button variant='ghost' onClick={()=>setView('select')}>
                                    Back
                                </Button>
                            </div>

                    </motion.div>
                )}

                {view==='folder' && (
                    <motion.div
                        key='folder'
                        initial={{opacity:0, y:10}}
                        animate={{opacity:1, y:0}}
                        exit={{opacity:0, y:-10}}
                        className='mt-4 space-y-4'
                    >
                        <div className='space-y-2'>
                            <Label htmlFor="folder-name">Folder name</Label>
                            <Input
                                id='folder-name'
                                placeholder='Enter folder name...'
                                value={folderName}
                                onChange={(e)=>setFolderName(e.target.value)}
                                onKeyDown={(e)=> e.key==='Enter' && handleCreateFolder()}
                                autoFocus
                            />
                        </div>
                        <div className='flex justify-between'>
                            <Button variant='ghost' onClick={()=>setView('select')}>
                                Back
                            </Button>
                            <Button onClick={handleCreateFolder} disabled={!folderName.trim()}>
                                Create Folder
                            </Button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

        </DialogContent>
        
    </Dialog>
  )
}

export default NewItemModal