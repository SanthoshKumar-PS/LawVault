import { createContext, useContext, useState, type ReactNode } from "react";
import type { BreadcrumbItem, FileItem, FolderItem, ViewMode } from "../types/TableTypes"
import { mockFiles, mockFolders } from "../mockData";

type FileManagerContextType = {
    files: FileItem[];
    folders: FolderItem[];
    currentFolderId: string|null;
    viewMode: ViewMode;
    selectedItems:string[];
    breadcrumps: BreadcrumbItem[];
    setViewMode: (mode:ViewMode) => void;
    setCurrentFolder: (folderId:string|null) => void;
    selectItem :(id:string,multiSelect?:boolean) => void;
    clearSelection: ()=>void;
    addFile:(file: Omit<FileItem,'id' | 'createdAt'|'updatedAt'>) => void;
    addFolder:(name:string) => void;
    deleteItems:(ids:string[]) => void;
    renameFolder:(id:string, newName:string) => void;
    moveItems:(ids:string[], targetFolderId:string|null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}


const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

export const FileManagerProvider = ({children}:{children: ReactNode}) => {
    const [files, setFiles] = useState<FileItem[]>(mockFiles);
    const [folders, setFolders] = useState<FolderItem[]>(mockFolders);
    const [currentFolderId, setCurrentFolderId] = useState<string|null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('large-grid');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('') 

    const getBreadCrumbs = (folderId:string|null):BreadcrumbItem[] => {
        const crumbs: BreadcrumbItem[] = [{id:null, name:'My Files'}];
        let currentId = folderId;
        while(currentId) {
            const folder = folders.find(f=> f.id === currentId);
            if(folder){
                crumbs.splice(1,0,{id:folder.id,name:folder.name});
                currentId=folder.parentId;
            } else{
                break;
            }
        }
        return crumbs;
    }

    const setCurrentFolder = (folderId:string | null) => {
        setCurrentFolderId(folderId);
        setSelectedItems([]);
    }

    const selectItem = (id:string, multiSelect = false)=>{
        if(multiSelect) {
            setSelectedItems(prev =>
                prev.includes(id)?prev.filter(i => i!==id) : [...prev,id]
            )
        } else{
            setSelectedItems([id]);
        }
    }

    const clearSelection = () => setSelectedItems([]);

    const addFile = (file:Omit<FileItem, 'id'|'createdAt'|'modifiedAt'>) => {
        const newFile:FileItem = {
            ...file,
            id:`file-${Date.now()}`,
            createdAt: new Date(),
            modifiedAt: new Date()
        }
        setFiles(prev=>[...prev, newFile])
    }

    const addFolder = (name:string) => {
        const newFolder :FolderItem ={
            id:`folder-${Date.now()}`,
            name,
            type:'folder',
            modifiedAt: new Date(),
            createdAt: new Date(),
            parentId: currentFolderId,
            ownerId: '1',
            itemCount:0
        }
        setFolders(prev => [...prev,newFolder])
    }

    const deleteItems = (ids:string[]) => {
        setFiles(prev => prev.filter(f=>!ids.includes(f.id)));
        setFolders(prev => prev.filter(f=>!ids.includes(f.id)));
        setSelectedItems([]);
    }

    const renameFolder = (id:string, newName:string) => {
        setFolders(prev => prev.map(f=>
            f.id === id ? {...f,name:newName, modifiedAt: new Date()} : f
        ))
    }

    const moveItems = (ids:string[], targetFolderId: string| null) => {
        setFiles(prev=> prev.map(f=>
            ids.includes(f.id)? {...f,parentId:targetFolderId, modifiedAt:new Date()}: f
        ))
        setSelectedItems([]);
    }

    return (
        <FileManagerContext.Provider
            value={{
                files,
                folders,
                currentFolderId,
                viewMode,
                selectedItems,
                breadcrumps:getBreadCrumbs(currentFolderId),
                setViewMode,
                setCurrentFolder,
                selectItem,
                clearSelection,
                addFile,
                addFolder,
                deleteItems,
                renameFolder,
                moveItems,
                searchQuery,
                setSearchQuery
            }}
        >
            {children}
        </FileManagerContext.Provider>
    )
}

export function useFileManager() {
    const context = useContext(FileManagerContext);
    if(!context){
        throw new Error('useFileManager must be used within a FileManageProvider')
    }
    return context;
}