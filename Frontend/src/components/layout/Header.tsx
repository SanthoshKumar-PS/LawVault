import { Bell, HelpCircle, LogOut, Menu, Server, User } from "lucide-react";
import { Button } from "../ui/button";
import {motion} from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
interface HeaderProps  {
  onMenuClick: ()=>void;
}
const Header = ({onMenuClick}:HeaderProps) => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant='ghost'
          size='icon'
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5"/>
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <motion.div
            transition={{duration:0.3}}
            className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center"
          >
            <Server className="h-5 w-5 text-primary-foreground"/>
          </motion.div>
          <span className="text-xl font-bold text-foreground hidden sm:block">LawVault</span>
        </div>
      </div>


      <div className="flex items-center gap-2">
        {/* Notification */}
        <Button variant='ghost' size='icon' className="relative">
          <Bell className="h-5 w-5"/>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"/>
        </Button>

        {/* Help */}
        <Button variant='ghost' size='icon' className="hidden sm:flex">
          <HelpCircle className="w-5 h-5"/>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className="h-10 w-10 bg-primary/10 text-primary text-sm font-semibold rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
              {currentUser?.name ? (
                  currentUser.name
                      .split(' ')
                      .filter(Boolean)
                      .map(n => n[0].toUpperCase())
                      .join('')
                      .slice(0, 2)
              ) : (
                  "?"
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            sideOffset={8}
            align="end" 
            className="w-56 bg-popover text-popover-foreground rounded-xl border shadow-xl p-1.5"
          >
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              My Account
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-border h-px my-1" />
            
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors focus:bg-accent focus:text-accent-foreground outline-none">
              <User className="h-4 w-4 text-muted-foreground"/>
              <span className="font-medium">Profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border h-px my-1" />
            
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors focus:bg-destructive/10 focus:text-destructive text-destructive outline-none"
              onClick={()=>{
                localStorage.clear();
                setCurrentUser(null)
                navigate('/');
              }}
            >
              <LogOut className="h-4 w-4"/>
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}

export default Header