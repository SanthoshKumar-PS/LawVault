import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { BreadcrumbItem, FileItem, FolderItem, ViewMode } from "../types/TableTypes"
import { mockFiles, mockFolders } from "../mockData";
import { useAuth } from "./AuthContext";
import api from "../lib/api";
import { toast } from "sonner";

type FileManagerContextType = {
    loading:boolean;
    files: FileItem[];
    folders: FolderItem[];
    currentFolderId: number|null;
    viewMode: ViewMode;
    selectedItems:number[];
    breadcrumps: BreadcrumbItem[];
    setBreadcrumps:(breadcrumps:BreadcrumbItem[])=>void;
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
    const [loading,setLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [breadcrumps, setBreadcrumps] = useState<BreadcrumbItem[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<number|null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('') 

    useEffect(()=>{
        console.log("Chnage in folders: ",folders)
    },[folders])
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
                setBreadcrumps(response.data.breadcrumbs)
                console.log("Axios response: ",response.data);
            } catch (error:any) {
                console.log('Error occured in fetchFoldersAndFiles: ',error)
                const status = error.response?.status;
                const serverMessage = error.response?.data.message || error.response?.data
                const errorMessage = serverMessage || 'Something went wrong'
                console.log("errorMessage: ",errorMessage);
                switch(status){
                    case 401:
                        toast.error('Session expired',{
                            description:'Please login again to continue.'
                        });
                        break;
                    case 403:
                        toast.error('Access Denied',{
                            description:'You do not have permission to view this folder.'
                        });
                        break;
                    case 404:
                        toast.error('Not Found', {
                            description: 'The requested folder does not exist.'
                        });
                        break;
                    case 500:
                        toast.error('Server Error', {
                            description: 'Our legal vault is temporarily down. Try again later.' 
                        });
                        break;
                    default:
                        toast.error('Connection Error', { description: errorMessage });
                }
                
            } finally{
                setLoading(false);
            }

        }
        
        fetchFoldersAndFiles();
    },[currentFolderId])

    const {currentUser} = useAuth();


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
            console.log(error);

        } finally{
            setLoading(false);
        }
    }
    // const addFolder = (name:string) => {
    //     const newFolder :FolderItem ={
    //         id: Date.now(),
    //     name,
    //     parentId: currentFolderId??undefined,
    //     parent: undefined, 
    //     children: [],      
    //     createdBy: 1,      
    //     creator: currentUser!,
    //     files: [],         
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     }
    //     setFolders(prev => [...prev,newFolder])
    // }

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
                loading,
                files,
                folders,
                currentFolderId,
                viewMode,
                selectedItems,
                breadcrumps,
                setBreadcrumps,
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