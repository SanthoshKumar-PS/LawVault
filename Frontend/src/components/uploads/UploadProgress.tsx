import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp, File, FileText, Image, Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export type UploadingFile = {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'cancelled'
}
type UploadProgressProps = {
  uploads:UploadingFile[];
  onUploadComplete:(uploadingFile:UploadingFile) => void;
  onClearCompleted: () => void;
  onCancelUpload?:(uploadId:string) => void;
}
const UploadProgress = ({uploads,onClearCompleted, onCancelUpload}:UploadProgressProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatFileSize = (bytes:number) => {
    if(bytes<1024) return `${bytes}B`
    if(bytes<1024*1024) return `${(bytes/1024).toFixed(1)} KB`
    return `${(bytes/(1024*1024)).toFixed(1)} MB`
  }

  const getFileIcon = (file:File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)){
      return <Image className="h-4 w-4 text-success"/>
    }
    if(['pdf', 'doc', 'docx', 'txt', 'pptx', 'xlsx'].includes(extension)){
      return <FileText className="h-4 w-4 text-file-document"/>
    }
    return <File className="h-4 w-4 text-primary"/>
  }

  const activeUploads = uploads.filter(u=>u.status!=='cancelled')

  if(activeUploads.length===0) return null;

  const uploadingCount = activeUploads.filter(u=> u.status==='uploading').length;
  const completedCount = activeUploads.filter(u=>u.status==='completed').length;
  const overallProgress= activeUploads.reduce((acc,u)=>acc+u.progress,0)/activeUploads.length;


  return (
    <motion.div
      initial={{opacity:0, y:100, scale:0.9}}
      animate={{opacity:1, y:0, scale:1}}
      exit={{opacity:0,y:100, scale:0.9}}
      className="fixed bottom-4 right-4 z-50 w-80 bg-card border rounded-xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer"
        onClick={()=>setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 ">
          {uploadingCount > 0 ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary"/>
          ) : (
            <CheckCircle2 className="h-4 w-4 text-success"/>
          )}

          <span className="text-sm font-medium">
            {uploadingCount>0
              ?`Uploading ${uploadingCount} file${uploadingCount>1?'s':''}...`
              :`${completedCount} upload${completedCount>1?'s':''} complete`
            }
          </span>
        </div>
        <div className="flex items-center gap-1">
          {completedCount === uploads.length && (
            <Button
              variant='ghost'
              size='icon'
              className="h-6 w-6"
              onClick={(e)=>{
                e.stopPropagation();
                onClearCompleted();
              }}
            >
              <X className="h-3 w-3"/>
            </Button>
          )}
          {isExpanded? (
            <ChevronDown className="h-4 w-4 text-muted-foreground"/>
          ):(
            <ChevronUp className="h-4 w-4 text-muted-foreground"/>
          )}

        </div>
      </div>

      {/* Overall Progress */}
      {uploadingCount>0 && (
        <div className="px-3 pb-2">
          <Progress value={overallProgress} className="h-1"/>
        </div>
      )}


      {/* FileList */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{height:0}}
            animate={{height:'auto'}}
            exit={{height:0}}
            className="overflow-hidden"
          >
            <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
              {activeUploads.map((upload)=>(
                <motion.div
                  key={upload.id}
                  initial={{opacity:0, x:-20}}
                  animate={{opacity:1, x:0}}
                  className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
                >
                  {getFileIcon(upload.file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{upload.file.name}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={upload.progress} className="h-1 flex-1"/>
                      <span className="text-[10px] text-muted-foreground w-8">
                        {Math.round(upload.progress)}%
                      </span>
                    </div>
                  </div>
                  {upload.status==='completed'? (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0"/>
                  ) : (
                    <Button
                      variant='ghost'
                      size='icon'
                      className="h-6 w-6 flex-shrink-0 hover:bg-destructive/10"
                      onClick={()=>onCancelUpload?.(upload.id)}
                      title="Cancel Upload"
                    >
                      <XCircle className="h-4 w-4 text-destructive"/>
                    </Button>
                  )}

                </motion.div>
              ))}

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default UploadProgress