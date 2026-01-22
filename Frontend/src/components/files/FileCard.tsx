import { motion } from 'framer-motion';
import { MoreVertical, Download, Eye, Move, Trash2, Star, Pencil } from 'lucide-react';
import type { FileItem, ViewMode } from '../../types/TableTypes';
import { useAuth } from '../../contexts/AuthContext';
import { useFileManager } from '../../contexts/FileManagerContext';
import { cn } from '../../lib/utils';
import { FileIcon } from './FileIcon';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import api from '../../lib/api';
import { useFileActions } from '../../contexts/FileActionContext';

type FileCardProps = {
    file: FileItem;
    viewMode: ViewMode;
}

function formatFileSize(bytes?:number) :string {
    if(!bytes) return '';
    const units = ['B', 'KB' , 'MB', 'GB'];
    let size = bytes;
    let unitIndex=0
    while(size>=1024 && unitIndex<units.length-1){
        size/=1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
}

const FileCard = ({ file, viewMode }:FileCardProps) => {
    const { hasPermission } = useAuth();
    const { handleFileOpen } = useFileActions()
    const { selectItem, selectedItems, deleteItems } = useFileManager();
    const isSelected = selectedItems.some(
        (item) => item.id === file.id && item.type === 'file'
    );;
    

    const handleClick = async (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation()
        selectItem(file.id, 'file',e.ctrlKey || e.metaKey);
    }

    
    if(viewMode === 'list'){
        return (
            <motion.div
                initial={{opacity:0, y:10}}
                animate={{opacity:1, y:0}}
                onClick={handleClick}
                onDoubleClick={()=>handleFileOpen(file.s3Key)}
                className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors border border-transparent group hover:bg-primary/10',
                    isSelected && 'bg-primary/50 border-primary/20'
                )}
            >
                <FileIcon file={file} size='md'/>
                <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm truncate'>{file.name}</p>
                </div>
                <p className='text-xs text-muted-foreground hidden sm:block w-24'>
                    {format(file.updatedAt, 'MMM d,yyyy')}
                </p>
                <p className='text-xs text-muted-foreground hidden md:block w-20 text-right'>
                    {formatFileSize(file.size)}
                </p>
                <FileActions file={file}/>

            </motion.div>
        )
    }

    const isLarge = viewMode==='large-grid';

    return (
        <motion.div
            initial={{opacity:0, scale:0.95}}
            animate={{opacity:1, scale:1}}
            whileInView={{y:-2}}
            onClick={handleClick}
            onDoubleClick={()=>handleFileOpen(file.s3Key)}
            className={cn(
                'group bg-card rounded-xl border border-border p-4 cursor-pointer file-card-hover',
                isSelected && 'ring-2 ring-primary border border-primary bg-primary/5',
                isLarge? 'p-6' : 'p-4'
            )}
        >
            {/* Icon */}
            <div className={cn(
                'flex items-center justify-center rounded-lg bg-secondary/50 mb-3',
                isLarge? 'h-32 w-full':'h-20 w-full'
            )}>
                <FileIcon file={file} size={isLarge?'xl':'lg'}/>
            </div>

            {/* Infor */}
            <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                    <p className='font-medium text-sm truncate'>{file.name}</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                        {formatFileSize(file.size)} • {format(file.updatedAt, 'MMM d')} 
                    </p>
                </div>
                <FileActions file={file}/>

            </div>

        </motion.div>
    )
}

export default FileCard

type FileActionsProps ={
    file:FileItem,
}
function FileActions({file}:FileActionsProps){
    const { hasPermission } = useAuth();
    const { deleteItems } = useFileManager();
    const { handleMoveClick, handleFileOpen } = useFileActions();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e)=>e.stopPropagation()}>
                <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 opacity-100 group-hover:opacity-100 transition-opacity'
                >
                    <MoreVertical className='h-4 w-4'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 bg-popover border border-border rounded-xl shadow-xl animate-in fade-in-0 zoom-in-95">
                {/* Add to Starred */}
                <DropdownMenuItem className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none transition-colors" onClick={()=>handleFileOpen(file.s3Key)}>
                    <Eye className="mr-3 h-4 w-4 text-warning" />
                    <span className="font-medium">Preview</span>
                </DropdownMenuItem>

                {/* Rename */}
                {hasPermission('edit_folder') && (
                    <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none transition-colors"
                    >
                        <Download className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Download</span>
                    </DropdownMenuItem>
                )}

                {/* Move */}
                {hasPermission('move') && (
                    <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMoveClick?.([{ id: file.id, type: 'file' }]);
                    }}
                    className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none transition-colors"
                    >
                    <Move className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Move to...</span>
                    </DropdownMenuItem>
                )}

                {/* Separator - Good for visual hierarchy before dangerous actions */}
                <div className="h-px bg-border my-1" />

                {/* Delete */}
                {hasPermission('create_folder') && (
                    <DropdownMenuItem
                    className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive outline-none transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        // deleteItems([folder.id]);
                    }}
                    >
                        <Trash2 className="mr-3 h-4 w-4" />
                        <span className="font-medium">Delete</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}