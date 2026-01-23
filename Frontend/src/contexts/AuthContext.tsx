import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PermissionOption, Permissions, User, UserRole } from "../types/TableTypes"

type AuthContextType = {
    currentUser: User | null;
    setCurrentUser:(user:User | null) => void;
    hasPermission: (permission:PermissionOption) => boolean;
    isAdmin:boolean;    
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}:{children:ReactNode}) => {
  const [currentUser, setCurrentUser] = useState<User|null>(()=>{
    const savedUser = localStorage.getItem('user');
    return savedUser? JSON.parse(savedUser) : null
  });

  useEffect(()=>{
    localStorage.setItem('user',JSON.stringify(currentUser));
  },[currentUser])
  
  const hasPermission = (permission:PermissionOption):boolean => {
    if(!currentUser) return false
    if(currentUser.role==='ADMIN') return true;
    return !!currentUser.permissions[permission];
  }

  const isAdmin = currentUser?.role==='ADMIN';

  return (
    <AuthContext.Provider value={{currentUser, setCurrentUser,hasPermission,isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}