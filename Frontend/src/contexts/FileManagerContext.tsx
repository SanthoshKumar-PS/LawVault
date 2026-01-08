import type { FileItem, FolderItem, ViewMode } from "../types/TableTypes"

type FileManagerContextType = {
    files: FileItem[];
    folders: FolderItem[];
    currentFolderId: string|null;
    viewMode: ViewMode;
    selectedItems:string[];
    breadcrumps:
}