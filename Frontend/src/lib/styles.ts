import type { ViewMode } from "../types/TableTypes";
import { cn } from "./utils";

export function getGridClass(viewMode:ViewMode){
    return cn(
        'grid gap-4',
        viewMode === 'list'
            ? 'grid grid-cols-1' 
            : viewMode === 'large-grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
    )
}