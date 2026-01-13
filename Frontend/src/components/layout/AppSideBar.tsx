import { 
  FolderOpen, 
  Clock, 
  Star, 
  Trash2, 
  Cloud, 
  HardDrive,
  Users,
  Settings,
  Plus,
  ChevronDown,
  ChevronsDown,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFileManager } from '../../contexts/FileManagerContext';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { Progress } from '../ui/progress';

type AppSideBarProps = {
    onNewClick:()=>void;
    onManageUsersClick:()=>void;
}
const AppSideBar = ({onNewClick, onManageUsersClick} : AppSideBarProps) => {
    const {isAdmin} = useAuth();
    const { setCurrentFolder, currentFolderId, folders } = useFileManager();
    const [foldersOpen, setFoldersOpen] = useState<boolean>(true);

    // const rootFolders = folders.filter(f=>f.parentId===null);
    const rootFolders = folders;
    const usedStorage = 4.2;
    const totalStorage = 15;
    const storagePercentage = Math.ceil((usedStorage/totalStorage)*100);
  return (
    <aside className='w-64 lg:w-72 h-full bg-card border-r border-border flex flex-col'>
        <div className='p-4 mt-10 lg:mt-0'>
            {/* New Button */}
            <Button
                size='lg'
                className='w-full gap-2 shadow-md hover:shadow-lg transition-shadow'
                onClick={onNewClick}
            >
                <Plus className='h-5 w-5'/>
                New
            </Button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin'>
            <SideBarItem
                icon={<FolderOpen className='h-5 w-5'/>}
                label="My Files"
                active={currentFolderId===null}
                onClick={()=>setCurrentFolder(null)}
            />
            <SideBarItem
                icon={<Clock className='h-5 w-5'/>}
                label="Recent"
            />
            <SideBarItem
                icon={<Star className='h-5 w-5'/>}
                label="Starred"
            />
            <SideBarItem
                icon={<Trash2 className='h-5 w-5'/>}
                label="Trash"
            />

            {/* Folders Section  */}
            <div className='pt-4'>
                <Collapsible open={foldersOpen} onOpenChange={setFoldersOpen}>
                    <CollapsibleTrigger className='flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-full hover:text-foreground transition-colors'>
                        <ChevronDown className={cn(
                            'h-4 w-4 transition-transform',
                            !foldersOpen && '-rotate-90'
                        )}/>
                        Folders
                    </CollapsibleTrigger>
                    <CollapsibleContent className='space-y-1 mt-1'>
                        {rootFolders.map(folder=>(
                            <SideBarItem
                                key={folder.id}
                                icon={<FolderOpen className='h-5 w-5 text-warning'/>}
                                label={folder.name}
                                active={currentFolderId===folder.id}
                                onClick={()=>setCurrentFolder(folder.id)}
                                badge={(folder._count?.files||0)+(folder._count?.children||0)}
                            />
                        ))}
                    </CollapsibleContent>
                
                </Collapsible>
            </div>
        </nav>

        {/* Storage Section */}
        <div className='p-4 border-t border-border'>
            <div className='flex items-center gap-2 mb-2'>
                <Cloud className='h-4 w-4 text-primary'/>
                <span className='text-sm font-medium'>Storage</span>
            </div>
            <Progress value={storagePercentage} className='h-2 mb-2'/>
            <p className='text-xs text-muted-foreground'>
                {usedStorage} GB of {totalStorage} GB used
            </p>
            <Button variant='outline' size='sm' className='w-full mt-3 text-xs'>
                <HardDrive className='h-3 w-3 mr-2'/>
                Upgrade Storage

            </Button>
        </div>
    </aside>
  )
}

export default AppSideBar



type SideBarItemProps = {
    icon:React.ReactNode;
    label:string;
    active?:boolean;
    onClick?:()=>void;
    badge?:number;
}
const SideBarItem = ({icon, label, active, onClick, badge}:SideBarItemProps) => {
  return (
    <motion.button
        whileHover={{x:2}}
        whileTap={{scale:0.98}}
        onClick={onClick}
        className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            active
                ?'bg-primary/10 text-primary'
                :'text-muted-foreground hover:bg-hover:light hover:text-foreground'
        )}
    >
        <span className='flex shrink-0'>{icon}</span>
        <span className='flex-1 text-left'>{label}</span>
        {badge !== undefined && badge>0 && (
            <span className='bg-primary-10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full'>
                {badge}
            </span>
        )}


    </motion.button>
  )
}

