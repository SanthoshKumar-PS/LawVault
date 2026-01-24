import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { BreadcrumbItem, FileItem, FolderItem, MoveItemType, ViewMode } from "../types/TableTypes"
import { useAuth } from "./AuthContext";
import api from "../lib/api";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { handleApiError } from "@/lib/handleApiError";

type FileManagerContextType = {
    loading:boolean;
    files: FileItem[];
    setFiles:Dispatch<SetStateAction<FileItem[]>>
    folders: FolderItem[];
    currentFolderId: number|null;
    viewMode: ViewMode;
    selectedItems:MoveItemType[];
    selectItem :(id:number, type:'file'|'folder', multiSelect?:boolean) => void;
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs:(breadcrumbs:BreadcrumbItem[])=>void;
    setViewMode: (mode:ViewMode) => void;
    setCurrentFolder: (folderId:number|null) => void;
    clearSelection: ()=>void;
    addFile:(file: FileItem ) => void;
    addFolder:(name:string) => void;
    deleteItems:(items:MoveItemType []) => void;
    renameFolder:(id:number, newName:string) => void;
    moveItems:(items:MoveItemType[], targetFolderId:number|null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    moveLoading: boolean,
    setMoveLoading: Dispatch<SetStateAction<boolean>>
}


const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

export const FileManagerProvider = ({children}:{children: ReactNode}) => {
    const [loading,setLoading] = useState<boolean>(false);
    const [moveLoading, setMoveLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<number|null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedItems, setSelectedItems] = useState<MoveItemType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const isHomePage = location.pathname.includes('/home');

    
    useEffect(()=>{
        const fetchFoldersAndFiles = async () =>{
            try {
                setLoading(true);
                const response = await api.get('/files',{
                    params:{
                        currentFolderId:currentFolderId
                    }
                });
                console.log("Folders: ", response.data.folders)
                setFolders(response.data.folders);
                setFiles(response.data.files);
                setBreadcrumbs(response.data.breadcrumbs)
                console.log("Axios response: ",response.data);
            } catch (error:any) {
                console.log("Error occurred in : fetchFoldersAndFiles ",error )
                handleApiError(error);                
            } finally{
                setLoading(false);
            }

        }
        
        if(isHomePage){
            fetchFoldersAndFiles();
        }
    },[currentFolderId, isHomePage])



    const setCurrentFolder = (folderId:number | null) => {
        setCurrentFolderId(folderId);
        setSelectedItems([]);
    }

    const selectItem = (id:number,  type:'file'|'folder', multiSelect = false)=>{
        const item = {id,type}
        if (multiSelect) {
                setSelectedItems(prev => {
                    const exists = prev.find(i => i.id === id && i.type === type);
                    return exists 
                        ? prev.filter(i => !(i.id === id && i.type === type)) 
                        : [...prev, item];
                });
            } else {
                setSelectedItems([item]);
            }
    }

    const clearSelection = () => setSelectedItems([]);

    const addFile = (file:FileItem) => {
        const newFile:FileItem = {
            ...file,
            id:Date.now(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setFiles(prev=>[...prev, newFile])
    }

    const addFolder = async (name:string) => {
        try{
            setLoading(true);
            const response = await api.post('/folder',{
                folderName:name,
                parentId:currentFolderId
            });
            const newFolder = response.data.newFolder;

            setFolders(prev=>[{...newFolder}, ...prev])
            console.log("newFolder: ",newFolder);
        } catch(error){
            console.log("Error occurred in : addFolder ",error)
            handleApiError(error); 

        } finally{
            setLoading(false);
        }
    }

    const deleteItems = (ids:MoveItemType[]) => {
        try {
            
        } catch (error:any) {
            console.log("Error occurred in : addFolder ",error)
            handleApiError(error); 
        }
        // setFiles(prev => prev.filter(f=>!ids.includes(f.id)));
        // setFolders(prev => prev.filter(f=>!ids.includes(f.id)));
        setSelectedItems([]);
    }

    const renameFolder = (id:number, newName:string) => {
        setFolders(prev => prev.map(f=>
            f.id === id ? {...f,name:newName, modifiedAt: new Date()} : f
        ))
    }

    const moveItems = async (items:MoveItemType[], targetFolderId: number| null) => {
        try {
            console.log("Parsms: ", {
                targetFolderId:targetFolderId,
                itemsIds: items
            })
            setMoveLoading(true);
            const toastId = toast.loading('Move folders and files...')
            const response = await api.get('/moveFoldersToTargetId',{
            params:{
                targetFolderId:targetFolderId,
                itemsIds: items
                }
            });
            toast.success('Selected items moved successfully.',{id:toastId})
            console.log("Navigated Folders: ", response.data.currentFolders)
            setCurrentFolderId(targetFolderId)
            console.log("Axios response: ",response.data);
        } catch (error:any) {
            console.log("Error occurred in : addFolder ",error)
            handleApiError(error);                 
        } finally{
            setMoveLoading(false);
        }
        setSelectedItems([]);
    }

    return (
        <FileManagerContext.Provider
            value={{
                loading,
                files,
                setFiles,
                folders,
                currentFolderId,
                viewMode,
                selectedItems,
                selectItem,
                breadcrumbs,
                setBreadcrumbs,
                setViewMode,
                setCurrentFolder,
                clearSelection,
                addFile,
                addFolder,
                deleteItems,
                renameFolder,
                moveItems,
                searchQuery,
                setSearchQuery,
                moveLoading,
                setMoveLoading
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