import { Folder, Loader2 } from "lucide-react";
import { useFileManager } from "../../contexts/FileManagerContext";
import { motion } from 'framer-motion';
import { cn } from "../../lib/utils";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
import { LoadingSpinner } from "../layout/LoadingSpinner";
import { getGridClass } from "../../lib/styles";

const FileGrid = () => {
    const {loading, files, folders, currentFolderId, viewMode, searchQuery, clearSelection} = useFileManager();
    const currentFolders = folders.filter(f=> {
        const matchesSearch = searchQuery
            ? f.name.toLowerCase().includes(searchQuery.toLowerCase())
            :true;
        return matchesSearch
    })

    const currentFiles = files.filter(f=>{
        const matchesSearch = searchQuery
            ? f.name.toLowerCase().includes(searchQuery.toLowerCase())
            :true
        return matchesSearch
    })

    if(loading){
        return (
            <LoadingSpinner/>
        )
    }

    const isEmpty = currentFolders.length===0 && currentFiles.length===0

    if(isEmpty){
        return (
            <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                className="flex flex-col items-center justify-center py-20"
            >
                <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                    <Folder className="h-12 w-12 text-muted-foreground"/>
                </div>
                <h3 className="text-lg font-medium mb-1">
                    {searchQuery ? 'No results found' : 'This folder is empty'}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {searchQuery
                        ? 'Try adjusting your search terms'
                        : 'Click "New" to add files or folders'
                    }
                </p>

            </motion.div>
        )
    }

    const gridClass = getGridClass(viewMode);

  return (
    <div onClick={()=>clearSelection()}>
        {/* Folder Section */}
        {currentFolders.length>0 && (
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Folders
                </h3>

                <div className={gridClass}>
                    {currentFolders.map((folder,index)=> (
                        <motion.div
                            key={folder.id}
                            initial={{opacity:0, y:20}}
                            animate={{opacity:1, y:0}}
                            transition={{delay:index*0.05}}
                        >
                            <FolderCard
                                folder={folder}
                                viewMode={viewMode}
                            />

                        </motion.div>
                    ))}

                </div>

            </div>
        )}

        {/* Files Section */}
        {currentFiles.length>0 && (
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Files
                </h3>
                <div className={gridClass}>
                    {currentFiles.map((file,index)=> (
                        <motion.div
                            key={file.id}
                            initial={{opacity:0, y:20}}
                            animate={{opacity:1, y:0}}
                            transition={{delay:(currentFolders.length+index)*0.05}}
                        >
                            <FileCard
                                file={file}
                                viewMode={viewMode}
                            />
                        </motion.div>
                    ))}

                </div>
            </div>
        )}
    </div>
  )
}

export default FileGrid