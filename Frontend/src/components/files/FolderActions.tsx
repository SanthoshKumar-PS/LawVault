import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import type { FolderItem } from "../../types/TableTypes";
import { useAuth } from "../../contexts/AuthContext";
import { useFileManager } from "../../contexts/FileManagerContext";
import { MoreVertical, Move, Pencil, Star, Trash2 } from "lucide-react";

type FolderActionsType = {
    folder: FolderItem;
    onRename?: (id:number)=>void;
    onMoveClick?:(ids:number[],names:string[])=>void;
}
const FolderActions = ({folder, onRename, onMoveClick}:FolderActionsType) => {
    const { hasPermission } = useAuth();
    const { deleteItems } = useFileManager();
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e)=>e.stopPropagation()}>
            <Button
                variant='ghost'
                size='icon'
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <MoreVertical className="h-4 w-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[100] w-56 p-1 bg-popover border border-border rounded-xl shadow-xl animate-in fade-in-0 zoom-in-95"
        >
        {/* Add to Starred */}
        <DropdownMenuItem className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none transition-colors">
            <Star className="mr-3 h-4 w-4 text-warning" />
            <span className="font-medium">Add to Starred</span>
        </DropdownMenuItem>

        {/* Rename */}
        {hasPermission('edit_folder') && (
            <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onRename?.(folder.id);
            }}
            className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none transition-colors"
            >
                <Pencil className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Rename</span>
            </DropdownMenuItem>
        )}

        {/* Move */}
        {hasPermission('move') && (
            <DropdownMenuItem
            onClick={(e) => {
                e.stopPropagation();
                onMoveClick?.([folder.id], [folder.name]);
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
        {hasPermission('delete_folder') && (
            <DropdownMenuItem
            className="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive outline-none transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                deleteItems([folder.id]);
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

export default FolderActions