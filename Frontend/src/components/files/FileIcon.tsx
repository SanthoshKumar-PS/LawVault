import { 
  File, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  FileSpreadsheet,
  Presentation,
  FileCode
} from 'lucide-react';
import type { FileType } from '../../types/TableTypes';
import { cn } from '../../lib/utils';

type FileIconProps = {
    type:FileType;
    extension?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?:string;
}

const sizeClasses = {
    sm:'h-5 w-5',
    md:'h-8 w-8',
    lg:'h-12 w-12',
    xl:'h-16 w-16',
}

const typeColors: Record<FileType, string> = {
    pdf:'text-file-pdf',
    document: 'text-file-document',
    image: 'text-file-image',
    video: 'text-file-video',
    audio: 'text-file-audio',
    archive: 'text-file-archive',
    folder: 'text-warning',
    other: 'text-file-default',    
}

export function FileIcon({type, extension, size='md',className }:FileIconProps){
    const iconClass = cn(sizeClasses[size], typeColors[type], className);
    if(extension){
        const ext = extension.toLowerCase();

        if(['xlsx', 'xls','csv'].includes(ext)){
            return <FileSpreadsheet className={cn(iconClass, 'text-success')}/>
        }
        if(['pptx','ppt'].includes(ext)){
            return <Presentation className={cn(iconClass, 'text-warning')}/>
        }
        if(['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'json', 'py'].includes(ext)){
            return <FileCode className={cn(iconClass, 'text-primary')}/>
        }
    }

    switch(type) {
        case 'document':
            return <FileText className={iconClass}/>;
        case 'image':
            return <Image className={iconClass}/>;
        case 'video':
            return <Video className={iconClass}/>;
        case 'audio':
            return <Music className={iconClass}/>;
        case 'archive':
            return <File className={iconClass}/>;
    }

}