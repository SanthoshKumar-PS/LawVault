import { useEffect, useState } from "react";
import { useFileManager } from "../../contexts/FileManagerContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../ui/dialog";
import { ArrowRight, ChevronRight, Folder, Home } from "lucide-react";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import {motion} from 'framer-motion';
import { Button } from "../ui/button";
import api from "../../lib/api";
import { toast } from "sonner";
import type { BreadcrumbItem, FolderItem } from "../../types/TableTypes";


type MoveToModalProps = {
    open:boolean;
    onOpenChange: (open:boolean) => void;
    itemsIds:number[];
}


const MoveToModal = ({ open, onOpenChange, itemsIds }: MoveToModalProps) => {
    const { folders, moveItems, currentFolderId, moveLoading, setMoveLoading } = useFileManager();
    const [selectedFolderId, setSelectedFolderId] = useState<number|null>(null);
    const [navigatedFolderId, setNavigatedFolderId] = useState<number|null>(null);
    const [currentFolders, setCurrentFolders] = useState<FolderItem[]>([]);
    const [currentBreadcrumbs, setCurrentBreadcrumbs] = useState<BreadcrumbItem[]>([]);


    const getAvailableFolders = async () =>{
        try {
            setMoveLoading(true);
            const response = await api.get('/folderNamesById',{
            params:{
                navigatedFolderId:navigatedFolderId,
                itemsIds: itemsIds
                }
            });
            console.log("Navigated Folders: ", response.data.currentFolders)
            setCurrentFolders(response.data.currentFolders);
            setCurrentBreadcrumbs(response.data.currentBreadcrumbs)
            console.log("Axios response: ",response.data);
        } catch (error:any) {
            console.log('Error occured in getAvailableFolders: ',error)
            const status = error.response?.status;
            const serverMessage = error.response?.data.message || error.response?.data
            const errorMessage = serverMessage || 'Something went wrong'
            console.log("errorMessage: ",errorMessage);
            switch(status){
                case 401:
                    toast.error('Session expired',{
                        description:'Please login again to continue.'
                    });
                    break;
                case 403:
                    toast.error('Access Denied',{
                        description:'You do not have permission to view this folder.'
                    });
                    break;
                case 404:
                    toast.error('Not Found', {
                        description: 'The requested folder does not exist.'
                    });
                    break;
                case 500:
                    toast.error('Server Error', {
                        description: 'Our legal vault is temporarily down. Try again later.' 
                    });
                       break;
                default:
                    toast.error('Connection Error', { description: errorMessage });
                }
                
        } finally{
            setMoveLoading(false);
        }

    }


    useEffect(() => {
    if (open) {
        getAvailableFolders();
    }
    }, [navigatedFolderId, open]);


    const handleMove = () => {
        moveItems(itemsIds, selectedFolderId);
        onOpenChange(false);
        setSelectedFolderId(null);
        setNavigatedFolderId(null);
    }

    const handleClose = () => {
        onOpenChange(false);
        setSelectedFolderId(null);
        setNavigatedFolderId(null);
    }

    const navigateToFolder = (folderId:number|null) => {
        setNavigatedFolderId(folderId);
        setSelectedFolderId(null);
    }

    const selectFolder = (folderId:number|null) => {
        setSelectedFolderId(folderId);
    }

    const selectedFolderName = (() => {
    if (selectedFolderId !== null) {
        return (
        folders.find(f => f.id === selectedFolderId)?.name ||
        currentFolders.find(f => f.id === selectedFolderId)?.name ||
        'Selected Folder'
        );
    }

    if (navigatedFolderId !== null) {
        return (
        folders.find(f => f.id === navigatedFolderId)?.name ||
        currentBreadcrumbs.find(b => b.id === navigatedFolderId)?.name ||
        'Current Folder'
        );
    }

    return 'My Files';
    })();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-primary"/>
                    Move {itemsIds.length} {itemsIds.length === 1 ? 'item':'items'}
                </DialogTitle>
                <DialogDescription>
                    Select a destination folder for the selected items.
                </DialogDescription>
            </DialogHeader>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1 text-sm overflow-x-auto py-2 px-1">
                {currentBreadcrumbs && currentBreadcrumbs.map((crumb, index)=> (
                    <div key={crumb.id??'root'} className="flex items-center">
                        {index>0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0"/>}
                        <button
                            onClick={()=> navigateToFolder(crumb.id)}
                            className={cn(
                                'hover:text-primary transition-colors whitespace-nowrap px-1 py-0.5 rounded',
                                crumb.id === navigatedFolderId && 'text-primary font-medium'
                            )}
                        >
                            {index===0 ? (
                                <Home className="h-4 w-4"/>
                            ): (
                                crumb.name
                            )}
                        </button>
                    </div>
                ))}
            </div>


            {/* Current Location Options */}
            <div
                onClick={()=> selectFolder(navigatedFolderId)}
                className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all mb-2',
                    selectedFolderId===navigatedFolderId
                        ? 'border-primary bg-primary/5'
                        : 'border-dashed border-border hover:border-primary/50'  
                )}
            >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Folder className="h-5 w-5 text-primary"/>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">Move here</p>
                    <p className="text-xs text-muted-foreground ">
                        {navigatedFolderId
                            ?folders.find(f=>f.id === navigatedFolderId)?.name
                            : 'My Files (root)'
                        }
                    </p>
                </div>
            </div>

            {/* Folder List */}
            <ScrollArea className="h-[250px] border rounded-lg">
                {currentFolders && currentFolders.length===0 ? (
                    <div className="flex flex-col items-center justify-center mb-2">
                        <Folder className="h-10 w-10 text-muted-foreground mb-2"/>
                        <p>No subfolders here</p>
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {currentFolders.map((folder,index)=> (
                            <motion.div
                                key={folder.id}
                                initial={{opacity:0, y:10}}
                                animate={{opacity:1, y:0}}
                                transition={{delay:index*0.03}}
                                className={cn(
                                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group',
                                    selectedFolderId===folder.id
                                        ? 'bg-primary/10 ring-2 ring-primary'
                                        : 'hover:bg-secondary'
                                )}
                                onClick={()=>selectFolder(folder.id)}
                                onDoubleClick={()=>navigateToFolder(folder.id)}
                            >
                                <Folder className="h-8 w-8 text-warning fill-warning/20 flex-shrink-0"/>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{folder.name}</p>
                                    <p className="text-xs text-muted-foreground">{(folder._count?.files||0)+(folder._count?.children??0)}</p>
                                </div>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        navigateToFolder(folder.id)
                                    }}
                                >
                                    <ChevronRight className="h-4 w-4"/>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <DialogFooter>
                <Button variant='outline' onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleMove}
                    disabled={selectedFolderId === currentFolderId || moveLoading}
                >
                    Move to {selectedFolderName}    
                </Button>
            </DialogFooter>

        </DialogContent>

    </Dialog>
  )
}

export default MoveToModal