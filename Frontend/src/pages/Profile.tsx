import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, Clock, FileText, FolderOpen, Mail, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/formatDate';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
const Profile = () => {
    const { currentUser, isAdmin } = useAuth();
    const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
    const [userCreated, setUserCreated] = useState<{filesCount:number, foldersCount:number}>({filesCount:0, foldersCount:0})

    const getProfileDetails = async () => {
        try {
            setIsProfileLoading(true);
            const response = await api.get('/user/profile');
            const {filesCount, foldersCount} = response.data;
            setUserCreated({filesCount, foldersCount})
            
        } catch (error:any) {
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
            setIsProfileLoading(false);
        }
    }

    useEffect(()=>{
        getProfileDetails();
    },[])

    const getInitials = (name:string)=>{
        return name.split(' ').map(n=>n[0]).join('').toUpperCase();
    }
  return (
    <div className='space-y-6 max-w-5xl'>
        {/* Header */}
        <div className='flex items-center gap-3'>
            <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                    <User className='h-6 w-6 text-primary'/>
                </div>
            </div>
            <div>
                <h1 className='text-2xl font-bold text-foreground'>Profile</h1>
                <p className='text-muted-foreground text-sm'>View and manage your profile information</p>
            </div>
        </div>

        {/* Profile Card */}
        <motion.div
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            className='bg-card border border-border rounded-xl p-6'
        >
            <div className='flex flex-col md:flex-row gap-6'>
                {/* Avatar Section */}
                <div className='flex flex-col items-center gap-4'>
                    <div className='relative'>
                        <Avatar className='h-32 w-32 border-4 border-primary/20'>
                            <AvatarImage src=''/>
                            <AvatarFallback className='bg-primary/10 text-primary text-2xl font-bold'>
                                {getInitials(currentUser?.name??'')}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <Badge variant={isAdmin ? 'default' : 'secondary'} className='text-xs'>
                        {isAdmin? 'Administrator' : 'User'}
                    </Badge>
                </div>

                {/* Info Section */}
                <div className='flex-1 space-y-4'>
                    <div>
                        <h2 className='text-2xl font-bold text-foreground'>{currentUser?.name}</h2>
                        <p className='text-muted-foreground'>{currentUser?.email}</p>
                    </div>
                    
                    <Separator/>

                    <div className='grid gap-4 md:grid-cols-2'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-secondary rounded-lg'>
                                <Mail className='h-4 w-4 text-muted-foreground'/>
                            </div>
                            <div>
                                <p className='text-xs text-muted-foreground'>Email</p>
                                <p className='text-sm font-medium text-foreground'>{currentUser?.email}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-secondary rounded-lg'>
                                <Shield className='h-4 w-4 text-muted-foreground'/>
                            </div>
                            <div>
                                <p className='text-xs text-muted-foreground'>Role</p>
                                <p className='text-sm font-medium text-foreground'>{currentUser?.role}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-secondary rounded-lg'>
                                <Calendar className='h-4 w-4 text-muted-foreground'/>
                            </div>
                            <div>
                                <p className='text-xs text-muted-foreground'>Member Since</p>
                                <p className='text-sm font-medium text-foreground'>{formatDate(currentUser!.createdAt.toString())}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-secondary rounded-lg'>
                                <Clock className='h-4 w-4 text-muted-foreground'/>
                            </div>
                            <div>
                                <p className='text-xs text-muted-foreground'>Last Active</p>
                                <p className='text-sm font-medium text-foreground'>Just Now</p>
                            </div>
                        </div>


                    </div>

                </div>

            </div>
        </motion.div>

        {/* Stats Section */}
        <div className='grid gap-4 md:grid-cols-2'>
            <motion.div
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.1 }}
                className='bg-card border border-border rounded-xl p-5'
            >
                <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 bg-primary/10 rounded-lg'>
                        <FileText className='h-5 w-5 text-primary'/>
                    </div>
                    <p className='text-sm text-muted-foreground'>Files Uploaded</p>
                </div>
                <p className='text-3xl font-bold text-foreground'>{userCreated.filesCount}</p>
            </motion.div>

            <motion.div
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.1 }}
                className='bg-card border border-border rounded-xl p-5'
            >
                <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 bg-warning/10 rounded-lg'>
                        <FolderOpen className='h-5 w-5 text-warning'/>
                    </div>
                    <p className='text-sm text-muted-foreground'>Folders Created</p>
                </div>
                <p className='text-3xl font-bold text-foreground'>{userCreated.foldersCount}</p>
            </motion.div>
        </div>

        {/* Permission Sections */}
        {!isAdmin && (
            <motion.div
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.4 }}
                className='bg-card border border-border rounded-xl p-6 space-y-4'
            >
                <h3 className='text-lg font-semibold text-foreground'>Your Permissions</h3>
                <div className='flex flex-wrap gap-2'>
                    {Object.entries(currentUser?.permissions || {})
                        .filter(([key, value]) => value === true && !['id', 'userId'].includes(key)) // Remove IDs and only keep 'true' values
                        .map(([permission]) => (
                            <Badge key={permission} variant='outline' className='capitalize'>
                                {permission.replace('_', ' ')}
                            </Badge>
                        ))
                    }
                </div>
                <p className='text-muted-foreground text-sm font-medium'>You can perform this actions. For more access contact admin.</p>

            </motion.div>
        )}

        {/* Admin */}
        {isAdmin && (
            <motion.div
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.4 }}
                className='bg-card border border-border rounded-xl p-6'
            >
                <h3 className='text-lg font-semibold text-foreground mb-4'>Administrator Access</h3>
                <p className='text-sm text-muted-foreground mb-4'>
                    As an administrator, you have full access to all features and can manage other users and their access.
                </p>
                <div className='flex flex-wrap gap-2'>
                    <Badge className='bg-primary/10 text-primary border-primary/20'>Full File Access</Badge>
                    <Badge className='bg-primary/10 text-primary border-primary/20'>User Management</Badge>
                    <Badge className='bg-primary/10 text-primary border-primary/20'>System Settings</Badge>
                    <Badge className='bg-primary/10 text-primary border-primary/20'>Security Controls</Badge>

                </div>
            </motion.div>
        )}


    </div>

  )
}

export default Profile