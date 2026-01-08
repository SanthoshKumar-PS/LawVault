export type UserRole = 'admin' | 'user';

export type Permission = 'upload' | 'download' | 'view' | 'move' | 'delete' | 'create_folder' | 'edit_folder' | 'delete_folder'

export type User = {
    id:string;
    name:string;
    email:string;
    role:UserRole;
    permissions:Permission[];
    avatar?:string;
}

export type FileType = 'document' | 'pdf' | 'image' | 'video' | 'audio' | 'archive' | 'folder' | 'other';

export type ViewMode = 'grid' | 'list' | 'large-grid';


export type FileItem = {
    id:string;
    name:string;
    type:FileType;
    size?:number;
    modifiedAt:Date;
    createdAt:Date;
    parentId: string | null;
    ownerId: string | null;
    extension?:string;
    thumbnailUrl?:string;
}

export type FolderItem = {
    id:string;
    name:string;
    type:'folder';
    modifiedAt: Date;
    createdAt: Date;
    parentId: string|null;
    ownerId: string;
    itemCount: number;
}

export type BreadcrumbItem = {
  id: string | null;
  name: string;
}