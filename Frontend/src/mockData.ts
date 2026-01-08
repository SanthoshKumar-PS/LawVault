import type { FileItem, FolderItem, User } from "./types/TableTypes";

export const adminUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@filecloud.com',
  role: 'admin',
  permissions: ['upload', 'download', 'view', 'move', 'delete', 'create_folder', 'edit_folder', 'delete_folder'],
};

export const regularUser: User = {
  id: '2',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  permissions: ['view', 'download'],
};

export const mockFolders: FolderItem[] = [
  { id: 'folder-1', name: 'Documents', type: 'folder', modifiedAt: new Date('2024-01-15'), createdAt: new Date('2024-01-01'), parentId: null, ownerId: '1', itemCount: 12 },
  { id: 'folder-2', name: 'Images', type: 'folder', modifiedAt: new Date('2024-01-20'), createdAt: new Date('2024-01-05'), parentId: null, ownerId: '1', itemCount: 45 },
  { id: 'folder-3', name: 'Projects', type: 'folder', modifiedAt: new Date('2024-01-22'), createdAt: new Date('2024-01-10'), parentId: null, ownerId: '1', itemCount: 8 },
  { id: 'folder-4', name: 'Archives', type: 'folder', modifiedAt: new Date('2024-01-18'), createdAt: new Date('2024-01-08'), parentId: null, ownerId: '1', itemCount: 3 },
  { id: 'folder-5', name: 'Work', type: 'folder', modifiedAt: new Date('2024-01-25'), createdAt: new Date('2024-01-12'), parentId: 'folder-1', ownerId: '1', itemCount: 5 },
];

export const mockFiles: FileItem[] = [
  { id: 'file-1', name: 'Annual Report 2024.pdf', type: 'document', size: 2500000, modifiedAt: new Date('2024-01-20'), createdAt: new Date('2024-01-15'), parentId: null, ownerId: '1', extension: 'pdf' },
  { id: 'file-2', name: 'Team Photo.jpg', type: 'image', size: 4500000, modifiedAt: new Date('2024-01-18'), createdAt: new Date('2024-01-10'), parentId: null, ownerId: '1', extension: 'jpg' },
  { id: 'file-3', name: 'Project Demo.mp4', type: 'video', size: 150000000, modifiedAt: new Date('2024-01-22'), createdAt: new Date('2024-01-20'), parentId: null, ownerId: '1', extension: 'mp4' },
  { id: 'file-4', name: 'Meeting Notes.docx', type: 'document', size: 125000, modifiedAt: new Date('2024-01-25'), createdAt: new Date('2024-01-24'), parentId: null, ownerId: '1', extension: 'docx' },
  { id: 'file-5', name: 'Backup.zip', type: 'archive', size: 75000000, modifiedAt: new Date('2024-01-19'), createdAt: new Date('2024-01-19'), parentId: null, ownerId: '1', extension: 'zip' },
  { id: 'file-6', name: 'Presentation.pptx', type: 'document', size: 8500000, modifiedAt: new Date('2024-01-23'), createdAt: new Date('2024-01-21'), parentId: null, ownerId: '1', extension: 'pptx' },
  { id: 'file-7', name: 'Podcast Episode.mp3', type: 'audio', size: 35000000, modifiedAt: new Date('2024-01-17'), createdAt: new Date('2024-01-16'), parentId: null, ownerId: '1', extension: 'mp3' },
  { id: 'file-8', name: 'Logo Design.png', type: 'image', size: 850000, modifiedAt: new Date('2024-01-21'), createdAt: new Date('2024-01-20'), parentId: null, ownerId: '1', extension: 'png' },
];