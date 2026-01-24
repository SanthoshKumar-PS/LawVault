import { motion } from "framer-motion";
import Toolbar from "../components/files/Toolbar";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FileItem } from "../types/TableTypes";
import { getGridClass } from "../lib/styles";
import { useFileManager } from "../contexts/FileManagerContext";
import FileCard from "../components/files/FileCard";
import { toast } from "sonner";
import api from "../lib/api";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";
import { handleApiError } from "@/lib/handleApiError";
const Recents = () => {
  const { viewMode } = useFileManager()
  const [recentsFiles,setRecentsFiles] = useState<FileItem[]>([]);
  const [recentsLoading, setRecentsLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const gridClass = getGridClass(viewMode);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastFileElementRef = useCallback((node:HTMLDivElement) => {
    if(recentsLoading) return;
    if(observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPageNo(prev=>prev+1)
      }
    });

    if(node) observer.current.observe(node);
    
  },[recentsLoading, hasMore]);

  const getRecentsFiles = async () => {
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
      setHasMore(response.data.hasMore);
    } catch(error:any){
      console.log("Error occurred in : getRecentsFiles ",error)
      handleApiError(error); 
    } finally{
      setRecentsLoading(false);
    }
  }

  useEffect(()=>{
    getRecentsFiles();
  },[pageNo])


  return (
    <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration: 0.3 }}
    >
        <Toolbar/>
        {/* Files Section */}
        {recentsFiles.length>0 && (
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Files
                </h3>
                <div className={gridClass}>
                    {recentsFiles.map((file,index)=> {
                      const isLastItem = recentsFiles.length === index+1
                      return (
                        <motion.div
                            key={file.id}
                            ref={isLastItem ? lastFileElementRef : null}
                            initial={{opacity:0, y:20}}
                            animate={{opacity:1, y:0}}
                            // transition={{delay:index*0.05}}
                        >
                            <FileCard
                                file={file}
                                viewMode={viewMode}
                            />
                        </motion.div>
                      )
                    })}

                </div>
            </div>
        )}
        {recentsLoading && (
          <LoadingSpinner/>
        )}
        

    </motion.div>
  )
}

export default Recents