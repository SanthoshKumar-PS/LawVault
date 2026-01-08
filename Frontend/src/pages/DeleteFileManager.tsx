import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileItem, FolderItem, ViewMode, BreadcrumbItem } from '@/types/fileManager';

interface FileManagerContextType {
  files: FileItem[];
  folders: FolderItem[];
  currentFolderId: string | null;
  viewMode: ViewMode;
  selectedItems: string[];
  breadcrumbs: BreadcrumbItem[];
  setViewMode: (mode: ViewMode) => void;
  setCurrentFolder: (folderId: string | null) => void;
  selectItem: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  addFile: (file: Omit<FileItem, 'id' | 'createdAt' | 'modifiedAt'>) => void;
  addFolder: (name: string) => void;
  deleteItems: (ids: string[]) => void;
  renameFolder: (id: string, newName: string) => void;
  moveItems: (ids: string[], targetFolderId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Mock data
const mockFolders: FolderItem[] = [
  { id: 'folder-1', name: 'Documents', type: 'folder', modifiedAt: new Date('2024-01-15'), createdAt: new Date('2024-01-01'), parentId: null, ownerId: '1', itemCount: 12 },
  { id: 'folder-2', name: 'Images', type: 'folder', modifiedAt: new Date('2024-01-20'), createdAt: new Date('2024-01-05'), parentId: null, ownerId: '1', itemCount: 45 },
  { id: 'folder-3', name: 'Projects', type: 'folder', modifiedAt: new Date('2024-01-22'), createdAt: new Date('2024-01-10'), parentId: null, ownerId: '1', itemCount: 8 },
  { id: 'folder-4', name: 'Archives', type: 'folder', modifiedAt: new Date('2024-01-18'), createdAt: new Date('2024-01-08'), parentId: null, ownerId: '1', itemCount: 3 },
  { id: 'folder-5', name: 'Work', type: 'folder', modifiedAt: new Date('2024-01-25'), createdAt: new Date('2024-01-12'), parentId: 'folder-1', ownerId: '1', itemCount: 5 },
];

const mockFiles: FileItem[] = [
  { id: 'file-1', name: 'Annual Report 2024.pdf', type: 'document', size: 2500000, modifiedAt: new Date('2024-01-20'), createdAt: new Date('2024-01-15'), parentId: null, ownerId: '1', extension: 'pdf' },
  { id: 'file-2', name: 'Team Photo.jpg', type: 'image', size: 4500000, modifiedAt: new Date('2024-01-18'), createdAt: new Date('2024-01-10'), parentId: null, ownerId: '1', extension: 'jpg' },
  { id: 'file-3', name: 'Project Demo.mp4', type: 'video', size: 150000000, modifiedAt: new Date('2024-01-22'), createdAt: new Date('2024-01-20'), parentId: null, ownerId: '1', extension: 'mp4' },
  { id: 'file-4', name: 'Meeting Notes.docx', type: 'document', size: 125000, modifiedAt: new Date('2024-01-25'), createdAt: new Date('2024-01-24'), parentId: null, ownerId: '1', extension: 'docx' },
  { id: 'file-5', name: 'Backup.zip', type: 'archive', size: 75000000, modifiedAt: new Date('2024-01-19'), createdAt: new Date('2024-01-19'), parentId: null, ownerId: '1', extension: 'zip' },
  { id: 'file-6', name: 'Presentation.pptx', type: 'document', size: 8500000, modifiedAt: new Date('2024-01-23'), createdAt: new Date('2024-01-21'), parentId: null, ownerId: '1', extension: 'pptx' },
  { id: 'file-7', name: 'Podcast Episode.mp3', type: 'audio', size: 35000000, modifiedAt: new Date('2024-01-17'), createdAt: new Date('2024-01-16'), parentId: null, ownerId: '1', extension: 'mp3' },
  { id: 'file-8', name: 'Logo Design.png', type: 'image', size: 850000, modifiedAt: new Date('2024-01-21'), createdAt: new Date('2024-01-20'), parentId: null, ownerId: '1', extension: 'png' },
];

const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined);

export function FileManagerProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [folders, setFolders] = useState<FolderItem[]>(mockFolders);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumbs = (folderId: string | null): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [{ id: null, name: 'My Files' }];
    let currentId = folderId;
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        crumbs.splice(1, 0, { id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    
    return crumbs;
  };

  const setCurrentFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedItems([]);
  };

  const selectItem = (id: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedItems(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedItems([id]);
    }
  };

  const clearSelection = () => setSelectedItems([]);

  const addFile = (file: Omit<FileItem, 'id' | 'createdAt' | 'modifiedAt'>) => {
    const newFile: FileItem = {
      ...file,
      id: `file-${Date.now()}`,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    setFiles(prev => [...prev, newFile]);
  };

  const addFolder = (name: string) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      modifiedAt: new Date(),
      createdAt: new Date(),
      parentId: currentFolderId,
      ownerId: '1',
      itemCount: 0,
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteItems = (ids: string[]) => {
    setFiles(prev => prev.filter(f => !ids.includes(f.id)));
    setFolders(prev => prev.filter(f => !ids.includes(f.id)));
    setSelectedItems([]);
  };

  const renameFolder = (id: string, newName: string) => {
    setFolders(prev => prev.map(f => 
      f.id === id ? { ...f, name: newName, modifiedAt: new Date() } : f
    ));
  };

  const moveItems = (ids: string[], targetFolderId: string | null) => {
    setFiles(prev => prev.map(f => 
      ids.includes(f.id) ? { ...f, parentId: targetFolderId, modifiedAt: new Date() } : f
    ));
    setFolders(prev => prev.map(f => 
      ids.includes(f.id) ? { ...f, parentId: targetFolderId, modifiedAt: new Date() } : f
    ));
    setSelectedItems([]);
  };

  return (
    <FileManagerContext.Provider
      value={{
        files,
        folders,
        currentFolderId,
        viewMode,
        selectedItems,
        breadcrumbs: getBreadcrumbs(currentFolderId),
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
        setSearchQuery,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
}

export function useFileManager() {
  const context = useContext(FileManagerContext);
  if (!context) {
    throw new Error('useFileManager must be used within a FileManagerProvider');
  }
  return context;
}
