import { createContext, useContext, useState, type ReactNode } from "react";
import type { BreadcrumbItem, FileItem, FolderItem, ViewMode } from "../types/TableTypes"
import { mockFiles, mockFolders } from "../mockData";
import { useAuth } from "./AuthContext";

type FileManagerContextType = {
    files: FileItem[];
    folders: FolderItem[];
    currentFolderId: number|null;
    viewMode: ViewMode;
    selectedItems:number[];
    breadcrumps: BreadcrumbItem[];
    setViewMode: (mode:ViewMode) => void;
    setCurrentFolder: (folderId:number|null) => void;
    selectItem :(id:number,multiSelect?:boolean) => void;
    clearSelection: ()=>void;
    addFile:(file: Omit<FileItem,'id' | 'createdAt'|'updatedAt'>) => void;
    addFolder:(name:string) => void;
    deleteItems:(ids:number[]) => void;
    renameFolder:(id:number, newName:string) => void;
    moveItems:(ids:number[], targetFolderId:number|null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}


const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

export const FileManagerProvider = ({children}:{children: ReactNode}) => {
    const [files, setFiles] = useState<FileItem[]>(mockFiles);
    const [folders, setFolders] = useState<FolderItem[]>(mockFolders);
    const [currentFolderId, setCurrentFolderId] = useState<number|null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('') 

    const {currentUser} = useAuth();

    const getBreadCrumbs = (folderId:number|null):BreadcrumbItem[] => {
        const crumbs: BreadcrumbItem[] = [{id:null, name:'My Files'}];
        let currentId = folderId;
        while(currentId) {
            const folder = folders.find(f=> f.id === currentId);
            if(folder){
                crumbs.splice(1,0,{id:folder.id,name:folder.name});
                currentId=folder.parentId??null;
            } else{
                break;
            }
        }
        return crumbs;
    }

    const setCurrentFolder = (folderId:number | null) => {
        setCurrentFolderId(folderId);
        setSelectedItems([]);
    }

    const selectItem = (id:number, multiSelect = false)=>{
        if(multiSelect) {
            setSelectedItems(prev =>
                prev.includes(id)?prev.filter(i => i!==id) : [...prev,id]
            )
        } else{
            setSelectedItems([id]);
        }
    }

    const clearSelection = () => setSelectedItems([]);

    const addFile = (file:Omit<FileItem, 'id'|'createdAt'|'updatedAt'>) => {
        const newFile:FileItem = {
            ...file,
            id:Date.now(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setFiles(prev=>[...prev, newFile])
    }

    const addFolder = (name:string) => {
        const newFolder :FolderItem ={
            id: Date.now(),
        name,
        parentId: currentFolderId??undefined,
        parent: undefined, 
        children: [],      
        createdBy: 1,      
        creator: currentUser!,
        files: [],         
        createdAt: new Date(),
        updatedAt: new Date(),
        }
        setFolders(prev => [...prev,newFolder])
    }

    const deleteItems = (ids:number[]) => {
        setFiles(prev => prev.filter(f=>!ids.includes(f.id)));
        setFolders(prev => prev.filter(f=>!ids.includes(f.id)));
        setSelectedItems([]);
    }

    const renameFolder = (id:number, newName:string) => {
        setFolders(prev => prev.map(f=>
            f.id === id ? {...f,name:newName, modifiedAt: new Date()} : f
        ))
    }

    const moveItems = (ids:number[], targetFolderId: number| null) => {
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