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
import { cn } from '../../lib/utils';
import type { FileItem, FileType } from '../../types/TableTypes';

type FileIconProps = {
    file: FileItem;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
}

const typeColors: Record<FileType, string> = {
    pdf: 'text-file-pdf',
    document: 'text-file-document',
    image: 'text-file-image',
    video: 'text-file-video',
    audio: 'text-file-audio',
    archive: 'text-file-archive',
    folder: 'text-warning',
    other: 'text-file-default',    
}

// Function to determine type from mimeType or extension
function getFileType(file: FileItem): FileType {
    const mime = file.mimeType.toLowerCase();
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (mime.includes('pdf') || ext === 'pdf') return 'pdf';
    if (mime.includes('word') || ['doc','docx','txt'].includes(ext || '')) return 'document';
    if (mime.includes('image') || ['jpg','jpeg','png','gif','bmp'].includes(ext || '')) return 'image';
    if (mime.includes('video') || ['mp4','mov','avi','mkv'].includes(ext || '')) return 'video';
    if (mime.includes('audio') || ['mp3','wav','aac'].includes(ext || '')) return 'audio';
    if (mime.includes('zip') || mime.includes('compressed') || ['zip','rar','7z'].includes(ext || '')) return 'archive';
    return 'other';
}

export function FileIcon({ file, size = 'md', className }: FileIconProps) {
    const type = getFileType(file);
    const iconClass = cn(sizeClasses[size], typeColors[type], className);
    const ext = file.name.split('.').pop()?.toLowerCase();

    // Override icons for some specific extensions
    if (ext) {
        if (['xlsx', 'xls','csv'].includes(ext)) {
            return <FileSpreadsheet className={cn(iconClass, 'text-success')} />;
        }
        if (['pptx','ppt'].includes(ext)) {
            return <Presentation className={cn(iconClass, 'text-warning')} />;
        }
        if (['js','ts','tsx','jsx','html','css','json','py'].includes(ext)) {
            return <FileCode className={cn(iconClass, 'text-primary')} />;
        }
    }

    switch(type) {
        case 'pdf':
        case 'document':
            return <FileText className={iconClass} />;
        case 'image':
            return <Image className={iconClass} />;
        case 'video':
            return <Video className={iconClass} />;
        case 'audio':
            return <Music className={iconClass} />;
        case 'archive':
            return <Archive className={iconClass} />;
        case 'folder':
        case 'other':
        default:
            return <File className={iconClass} />;
    }
}
