import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { BreadcrumbItem, FileItem, FolderItem, MoveItemType, ViewMode } from "../types/TableTypes"
import { useAuth } from "./AuthContext";
import api from "../lib/api";
import { toast } from "sonner";
import { data, useLocation } from "react-router-dom";
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
    deleteItems:(itemsIds:MoveItemType []) => void;
    renameItemByType:(id:number,type:'file'|'folder', newName:string) =>Promise<any>;
    moveItems:(items:MoveItemType[], targetFolderId:number|null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    moveLoading: boolean,
    setMoveLoading: Dispatch<SetStateAction<boolean>>;
    recentsFiles: FileItem[];
    recentsLoading:boolean;
    fetchRecents:(page:number) => Promise<void>;
    hasMoreRecents:boolean
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
    const [recentsFiles, setRecentsFiles] = useState<FileItem[]>([]);
    const [hasMoreRecents, setHasMoreRecents] = useState(false);
    const [recentsLoading, setRecentsLoading] = useState<boolean>(false);

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

  const fetchRecents = async (pageNo:number) => {
    try{
      setRecentsLoading(true);
      const response = await api.get('/files/recents', {
        params:{
          page:pageNo,
          limit:10
        }
      })
      console.log("Recents Response: ", response.data);
      const newFiles = response.data.files;
      setRecentsFiles(prev=>{
        const existingIds = new Set(prev.map(file=>file.id))
        const uniqueNewFiles = newFiles.filter((file:FileItem) => !existingIds.has(file.id))
        return [...prev, ...uniqueNewFiles]
      })
      setHasMoreRecents(response.data.hasMore);
    } catch(error:any){
      console.log("Error occurred in : getRecentsFiles ",error)
      handleApiError(error); 
    } finally{
      setRecentsLoading(false);
    }
  }


    useEffect(()=>{
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

    const deleteItems = async (itemsIds:MoveItemType[]) => {
        const toastId = toast.loading('Deleting files...');
        try {
            const response = await api.delete('/delete/filesandfoldersIds',{
                data:{
                    itemsIds
                }
            });
            setSelectedItems([]);
            console.log("Delete Items Response: ", response);
            toast.success('Deleted successfully',{id:toastId});
            fetchFoldersAndFiles();
        } catch (error:any) {
            toast.dismiss(toastId);
            console.log("Error occurred in : addFolder ",error);
            handleApiError(error); 
        }
    }

    const renameItemByType = async (id:number, type:'file' | 'folder',  newName:string) => {
        try {
            const response = await api.patch('/renameFileOrFolder',{
                id, type, newName
            });
            // TOREVIEW
            setFiles(prev => prev.map(item => 
                (item.id === id && type === 'file') ? { ...item, name: newName } : item
            ));

            setFolders(prev => prev.map(item => 
                (item.id === id && type === 'folder') ? { ...item, name: newName } : item
            ));

            setRecentsFiles(prev => prev.map(item => 
                (item.id === id && type === 'file') ? { ...item, name: newName } : item
            ));

            toast.success("Renamed successfully");
            console.log("Success");
            return response.data;
        } catch (error:any) {
            console.log("Error occured while renaming the file");
            handleApiError(error);
            throw error;        
        }
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
                renameItemByType,
                moveItems,
                searchQuery,
                setSearchQuery,
                moveLoading,
                setMoveLoading,
                recentsFiles,
                recentsLoading,
                fetchRecents,
                hasMoreRecents
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