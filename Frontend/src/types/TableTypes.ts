export type UserRole = 'ADMIN' | 'USER';

export type PermissionOption = 'upload' | 'download' | 'view' | 'move' | 'delete' | 'create_folder' | 'edit_folder' | 'delete_folder'
export type Permissions = {
    id:number;
    userId:number;
    view:boolean;
    upload:boolean;
    download:boolean;
    delete:boolean;
    create_folder:boolean;
    edit_folder:boolean;
    delete_folder:boolean;
    move:boolean;
}

export type User = {
    id:string;
    email:string;
    name:string;
    role:UserRole;
    permissions:Permissions;
    files:FileItem[]
}

export type FileType = 'document' | 'pdf' | 'image' | 'video' | 'audio' | 'archive' | 'folder' | 'other';

export type ViewMode = 'grid' | 'list' | 'large-grid';


export type FolderItem = {
  id: number;
  name: string;
  parentId?:number;
  parent?: FolderItem;
  children: FolderItem[]
  
  createdBy: number;
  creator: User;
  files: FileItem[]

  createdAt: Date;
  updatedAt: Date;
  _count?:{
    files: number, 
    children: number
  }
}

export type FileItem = {
  id: number;
  name:string;
  s3Key: string
  size:number
  mimeType:string

  createdBy: number 
  creator: User

  folderId: number
  folder: FolderItem

  createdAt: Date
  updatedAt: Date
}


export type BreadcrumbItem = {
  id: number | null;
  name: string;
}