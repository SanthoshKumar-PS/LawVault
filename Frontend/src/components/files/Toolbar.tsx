import { ChevronRight, Download, Grid, LayoutGrid, List, Move, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useFileManager } from "../../contexts/FileManagerContext";
import { 
    Breadcrumb,  
    BreadcrumbItem as BreadcrumbItemUI,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../ui/breadcrumb";
import {motion} from 'framer-motion';
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { ViewMode } from "../../types/TableTypes";
import { cn } from "../../lib/utils";

type ToolbarProps = {
    onMoveClick: (ids:number[], names:string[]) => void;
}
const Toolbar = ({onMoveClick}:ToolbarProps) => {
    const {viewMode, setViewMode, breadcrumps, setCurrentFolder, selectedItems, deleteItems, files, folders} = useFileManager();
    const {hasPermission} = useAuth();

    const getSelectedNames = () => {
        return selectedItems.map(id=>{
            const file = files.find(f=>f.id===id);
            if(file) return file.name;
            const folder = folders.find(f=>f.id===id);
            if(folder) return folder.name
            return 'Unknown';
        })
    }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Breadcrumb */}
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumps.map((crump,index)=>(
                    <div key={crump.id??'root'} className="flex items-center">
                        {index>0 && (
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4"/>
                            </BreadcrumbSeparator>
                        )}
                        <BreadcrumbLink
                            onClick={()=> setCurrentFolder(crump.id)}
                            className="cursor-pointer hover:text-primary transition-colors"
                        >
                            {crump.name}
                        </BreadcrumbLink>

                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>

        {/* Actions */}
        <div className="flex items-center gap-2">
            {/* Bulk Actions */}
            {selectedItems.length>0 && (
                <motion.div
                    initial={{opacity:0, scale:0.9}}
                    animate={{opacity:1, scale:1}}
                    className="flex items-center gap-2 mr-4 pr-4 border-r border-border"
                >
                    <span className="text-sm text-muted-foreground">
                        {selectedItems.length} selected
                    </span>
                    {hasPermission('download') && (
                        <Button variant='outline' size='sm'>
                            <Download className="h-4 w-4 mr-1"/>
                            Download
                        </Button>
                    )}
                    {hasPermission('move') && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={()=> onMoveClick(selectedItems, getSelectedNames())}
                        >
                            <Move className="h-4 w-4 mr-1"/>
                            Move
                        </Button>
                    )}
                    {hasPermission('delete') && (
                        <Button
                            variant='outline'
                            size='sm'
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <Trash2 className="h-4 w-4 mr-1"/>
                            Delete
                        </Button>
                    )}

                </motion.div>
            )}

            {/* View Toggle */}
            <ToggleGroup 
                type="single"
                value={viewMode}
                onValueChange={(value)=>value&& setViewMode(value as ViewMode)}
                className="bg-secondary/50 rounded-lg p-1"
            >
                <ToggleGroupItem
                    value="grid"
                    aria-label="Grid View"
                    className={cn(
                        'h-8 w-8 p-0',
                        viewMode === 'grid' && 'bg-card shadow-md'
                    )}
                >
                    <Grid className="h-4 w-4"/>
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="large-grid"
                    aria-label="Large grid view"
                    className={cn(
                        'h-8 w-8 p-0',
                        viewMode === 'large-grid' && 'bg-card shadow-md'
                    )}
                >
                    <LayoutGrid className="h-4 w-4"/>
                </ToggleGroupItem>
  
                <ToggleGroupItem
                    value="list"
                    aria-label="List View"
                    className={cn(
                        'h-8 w-8 p-0',
                        viewMode === 'list' && 'bg-card shadow-md'
                    )}
                >
                    <List className="h-4 w-4"/>
                </ToggleGroupItem>

            </ToggleGroup>


        </div>

    </div>
  )
}

export default Toolbar