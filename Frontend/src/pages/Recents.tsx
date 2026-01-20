import { motion } from "framer-motion";
import Toolbar from "../components/files/Toolbar";
import { useEffect, useState } from "react";
import type { FileItem } from "../types/TableTypes";
import { getGridClass } from "../lib/styles";
import { useFileManager } from "../contexts/FileManagerContext";
import FileCard from "../components/files/FileCard";
import { toast } from "sonner";
import api from "../lib/api";
const Recents = () => {
  const { viewMode } = useFileManager()
  const [recentsFiles,setRecentsFiles] = useState<FileItem[]>([]);
  const [recentsLoading, setRecentsLoading] = useState<boolean>(false);


  const gridClass = getGridClass(viewMode);

  const getRecentsFiles = async () => {
    try{
      setRecentsLoading(true);
      const response = await api.get('/files/recents', {
        params:{
          // Null
        }
      })
      console.log("Recents Response: ", response.data);
      setRecentsFiles(response.data.files);
    } catch(error:any){
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
      setRecentsLoading(true);
    }
  }

  useEffect(()=>{
    getRecentsFiles();
  },[])

  if(recentsLoading){
    <div>Loading...</div>
  }

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
                    {recentsFiles.map((file,index)=> (
                        <motion.div
                            key={file.id}
                            initial={{opacity:0, y:20}}
                            animate={{opacity:1, y:0}}
                            transition={{delay:index*0.05}}
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
        

    </motion.div>
  )
}

export default Recents