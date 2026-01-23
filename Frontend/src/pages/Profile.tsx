import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, Clock, FileText, FolderOpen, Mail, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/formatDate';
const Profile = () => {
    const { currentUser, isAdmin } = useAuth();
    const stats = {
        filesUploaded: 128,
        foldersCreated: 24,
        storageUsed: 4.2,
        totalStorage: 15,
        lastActive: new Date().toISOString(),
        memberSince: '2024-06-15T10:30:00.000Z',
    };

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
                <p className='text-3xl font-bold text-foreground'>{stats.filesUploaded}</p>
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
                <p className='text-3xl font-bold text-foreground'>{stats.foldersCreated}</p>
            </motion.div>
        </div>


    </div>

  )
}

export default Profile