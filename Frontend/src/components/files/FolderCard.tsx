import { motion } from "framer-motion"
import type { FolderItem, ViewMode } from "../../types/TableTypes"
import { useAuth } from "../../contexts/AuthContext";
import { useFileManager } from "../../contexts/FileManagerContext";
import { cn } from "../../lib/utils";
import { Folder, MoreVertical, Move, Pencil, Star, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import FolderActions from "./FolderActions";


type FolderCardProps = {
    folder:FolderItem;
    viewMode : ViewMode;
    onRename?: (id:string) => void;
    onMoveClick?: (ids:string[],names:string[]) => void;
}
const FolderCard = ({folder, viewMode, onRename, onMoveClick}:FolderCardProps) => {
    const { hasPermission } = useAuth();
    const { selectItem, selectedItems, setCurrentFolder, deleteItems } = useFileManager();
    const isSelected = selectedItems.includes(folder.id);

    const handleClick = (e:React.MouseEvent) => {
        e.stopPropagation();
        selectItem(folder.id, e.ctrlKey || e.metaKey)
    }

    const handleDoubleClick = () => {
        setCurrentFolder(folder.id)
    }
    if(viewMode === 'list') {
        return (
            <motion.div
                initial={{opacity:0, y:10}}
                animate={{opacity:1, y:0}}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors border border-transparent group hover:bg-primary/10',
                    isSelected && 'bg-primary/10 border-primary/20'
                )}
            >
                <Folder className="h-8 w-8 text-warning fill-warning/20"/>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{folder.name}</p>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block w-24">
                    {format(folder.modifiedAt, 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-muted-foreground hidden md:block w-20 text-right">
                    {folder.itemCount} items
                </p>
                <FolderActions folder={folder} onRename={onRename} onMoveClick={onMoveClick}/>

            </motion.div>
        )
    }


    const isLarge = viewMode === 'large-grid'
    return (
        <motion.div
            initial={{opacity:0, scale:0.95}}
            animate={{opacity:1, scale:1}}
            whileHover={{y:-2}}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className={cn(
                'group bg-card rounded-xl border border-border cursor-pointer file-card-hover',
                isSelected && 'ring-2 ring-primary border-primary bg-primary/5',
                isLarge?'p-6' : 'p-4'
            )}
        >
            {/* Icon */}
            <div className={cn(
                'flex items-center justify-center rounded-lg bg-warning/10 mb-3',
                isLarge ? 'h-32 w-full' : 'h-20 w-full'
            )}>
                <Folder className={cn(
                    'text-warning fill-warning/20',
                    isLarge? 'h-16 w-16' : 'h-12 w-12'
                )}/>
            </div>
            
            {/* Info */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{folder.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {folder.itemCount} items
                    </p>
                </div>
                <FolderActions folder={folder} onRename={onRename} onMoveClick={onMoveClick}/>
            </div>

        </motion.div>
    )
}

export default FolderCard






