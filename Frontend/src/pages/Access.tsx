import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, MoreVertical, Mail, Shield, Trash2, Edit, ShieldCheck, CircleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import {
    Badge
} from '../components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import type { PermissionOption, User, Permissions } from '../types/TableTypes';
import { toast } from 'sonner';
import api from '../lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { formatDate } from '@/lib/formatDate';
import { handleApiError } from '@/lib/handleApiError';
const Access = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [permissionDraft, setPermissionDraft] = useState<Permissions|null>(null);
    const [isAccessLoading, setAccessLoading] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const getUserWithPermissions = async () => {
        try {
            setAccessLoading(true);
            const response = await api.get('/user/access');
            setUsers(response.data.users);
            console.log("Access Users: ", response.data.users)            
        } catch (error:any) {
            console.log("Error occurred in : getUserWithPermissions ",error)
            handleApiError(error); 
        } finally{
            setAccessLoading(false);
        }
    }

    useEffect(()=>{
        getUserWithPermissions()
    },[]);

    const permissionConfig :{key:PermissionOption, label:string, description:string}[] = [
        { key: 'view', label: 'View Files', description: 'Can view files and folders' },
        { key: 'download', label: 'Download', description: 'Can download files' },
        { key: 'upload', label: 'Upload', description: 'Can upload new files' },
        { key: 'move', label: 'Move', description: 'Can move files between folders' },
        { key: 'delete', label: 'Delete Files', description: 'Can delete files' },
        { key: 'create_folder', label: 'Create Folders', description: 'Can create new folders' },
        { key: 'edit_folder', label: 'Edit Folders', description: 'Can rename folders' },
        { key: 'delete_folder', label: 'Delete Folders', description: 'Can delete folders' },
    ];



    const getPermissionBadges = (user:User) => {
        if(user.role === 'ADMIN'){
            return (
                <Badge className='flex gap-1 flex-wrap'>
                    <ShieldCheck className='h-3 w-3 mr-1'/>
                    Full Access
                </Badge>
            )
        }

        const permissions = user?.permissions || {};
        const activeParams = permissionConfig.filter(p=>permissions[p.key]);
        const displayParams = activeParams.slice(0,3);

        return (
            <div className='flex gap-1 flex-wrap'>
                {displayParams.map(perm=>(
                    <Badge key={perm.key} variant='outline' className='text-xs'>
                        {perm.label}
                    </Badge>
                ))}
                {activeParams.length>3 && (
                    <Badge variant='outline' className='text-xs'>
                        +{activeParams.length-3}
                    </Badge>
                )}
                {activeParams.length==0 && (
                    <span className="text-xs text-muted-foreground">No permissions</span>
                )}
            </div>
        )
    }

    const getActivePermissionsCount = (permissions:Permissions)=>{
        return permissionConfig.filter(p=>permissions[p.key]).length;
    }

    const updateUserPermissions = async () => {
        try {
            setIsUpdating(true);
            const response = await api.put('/user/permissions',{
                permissionDraft:permissionDraft
            });
            console.log("Response: ", response);
            if(selectedUser && permissionDraft){
                setUsers(prevUsers => prevUsers.map(user=>(
                    user.id===selectedUser?.id 
                    ? {...user, permissions:permissionDraft} 
                    : user 
                )));
            }

            setSelectedUser(null);
            setPermissionDraft(null);
            
        } catch (error:any) {
            console.log("Error occurred in : updateUserPermissions ",error)
            handleApiError(error);  
        } finally{
            setIsUpdating(false);
        }
    }

    useEffect(()=>{
        console.log("Chnages user permissions");
        console.log("selectedUser: ",selectedUser)
        console.log("selectedPermis: ",permissionDraft)
    },[selectedUser,permissionDraft])

    
  return (
    <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                    <Users className='h-6 w-6 text-primary'/>
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-foreground'>Manage User</h1>
                    <p className='text-muted-foreground text-sm'>Manage team members</p>
                </div>

            </div>

        </div>

        {/* Users Table */}
        <div className='bg-card border border-border rounded-xl'>
            <Table className='overflow-x-auto lg:overflow-hidden'>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user,index)=>(
                        <motion.tr
                            key={user.id}
                            initial={{ opacity:0,y:10 }}
                            animate={{ opacity:1, y:1 }}
                            transition={{ delay: index*0.05 }}
                            className='border-b border-border last:border-0 hover:bg-muted/50'
                        >
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <Avatar className='h-9 w-9'>
                                        <AvatarImage src=''/>
                                        <AvatarFallback className='bg-primary/10 text-primary text-sm'>
                                            {user.name.split(' ').map(n=>n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='font-medium text-foreground'>{user.name}</p>
                                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role==='ADMIN'?'default':'secondary'}>
                                    {user.role==='ADMIN' && <ShieldCheck className='h-3 w-3 mr-1'/>}
                                    {user.role}

                                </Badge>
                            </TableCell>
                            <TableCell>
                                {formatDate(user.createdAt.toString())}
                            </TableCell>
                            <TableCell>
                                {getPermissionBadges(user)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover border border-border z-50">
                                        <DropdownMenuItem onClick={()=>{
                                            setSelectedUser(user);
                                            setPermissionDraft(user.permissions)
                                        }}>
                                            <Shield className="mr-2 h-4 w-4" />
                                            Edit Permissions
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit User
                                        </DropdownMenuItem>
                                        {user.role !== 'ADMIN' && (
                                            <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove User
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>

                        </motion.tr>
                    ))}
                </TableBody>
            </Table>

        </div>

      <Dialog open={!!selectedUser && !!permissionDraft} onOpenChange={()=>{setSelectedUser(null); setPermissionDraft(null);}}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Edit Permissions
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.role === 'ADMIN' 
                ? `${selectedUser?.name} is an admin with full access to all features.`
                : `Manage permissions for ${selectedUser?.name}`
              }
            </DialogDescription>
        </DialogHeader>

        {selectedUser && (
            <div className='space-y-4 pt-2'>
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium">{selectedUser.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                    <Badge variant={selectedUser.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {selectedUser.role}
                    </Badge>
                </div>

            </div>
        )}
          
        {/* Admin Full Access Banner */}
        {selectedUser && selectedUser.role === 'ADMIN' && (
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                    <p className="font-medium text-primary">Full Access Granted</p>
                    <p className="text-sm text-muted-foreground">
                      Admins automatically have all permissions enabled.
                    </p>
                </div>
            </div>
        )}

        {/* Permissions Grid */}
        {selectedUser && selectedUser.permissions && permissionDraft && (
            <div className='grid gap-2'>
                {permissionConfig.map(permission=>{
                    const isEnabled = selectedUser.role === 'ADMIN' || permissionDraft[permission.key];
                    const isUserAdmin = selectedUser.role === 'ADMIN'
                    return (
                        <div
                            key={permission.key}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors 
                                ${isEnabled? 'bg-primary/5 border-primary/20': 'bg-muted/30 border-border'}`}
                        >
                            <div className='flex-1'>
                                <p className={`font-medium text-sm ${isEnabled?'text-foreground':'text-muted-foreground'}`}>
                                    {permission.label}
                                </p>
                                <p className='text-xs text-muted-foreground'>{permission.description}</p>
                            </div>
                            <Switch 
                                checked={isEnabled}
                                onCheckedChange={(checked)=>{
                                    setPermissionDraft(prev => ({
                                        ...prev!,
                                        [permission.key]: checked
                                    }));
                                }}
                                disabled={isUserAdmin}
                                className={isUserAdmin?'opacity-50':''}
                            />


                        </div>
                    )
                })}

            </div>
        )}

        {/* No Permission Data */}
        {!selectedUser?.permissions && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-lg">
                <CircleAlert className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="font-medium text-foreground">No Permissions Found</p>
                    <p className="text-sm text-muted-foreground">
                        This user doesn't have any specific permissions.
                    </p>
                </div>
            </div>
        )}

        {/* Summary */}
        {selectedUser && selectedUser.role!=='ADMIN' && selectedUser.permissions && (
            <div className='flex items-center justify-between pt-2 text-sm text-muted-foreground border-t'>
                <span>Active Permissions</span>
                <span className='font-medium text-foreground'>
                    {getActivePermissionsCount(permissionDraft!)} of {permissionConfig.length}
                </span>
            </div>
        )}

        {/* Buttons */}
        {selectedUser && selectedUser.role!=='ADMIN'&& (
            <div className='flex items-center gap-2'>
                <Button variant='outline' className='flex-1 hover:bg-blue-200/50 hover:text-blue-500 transition-colors duration-500' onClick={()=>{
                    setSelectedUser(null);
                    setPermissionDraft(null);
                }}>
                    Cancel
                </Button>
                <Button variant='default' className='flex-1'
                    onClick={()=>{
                        updateUserPermissions();
                    }}
                >
                    {isUpdating? 'Updating...':'Update'}
                </Button>
            </div>
        )}

        </DialogContent>
      </Dialog>



    </div>
  )
}

export default Access