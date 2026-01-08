import { createContext, useContext, useState, type ReactNode } from "react";
import type { Permission, User, UserRole } from "../types/TableTypes"
import { adminUser, regularUser } from "../mockData";

type AuthContextType = {
    currentUser: User;
    setUserRole:(role:UserRole) => void;
    hasPermission: (permission:Permission) => boolean;
    isAdmin:boolean;    
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}:{children:ReactNode}) => {
  const [currentUser, setCurrentUser] = useState<User>(adminUser);
  
  const setUserRole = (role:UserRole) => {
    setCurrentUser(role==='admin'?adminUser:regularUser);
  }

  const hasPermission = (permission:Permission):boolean => {
    if(currentUser.role==='admin') return true;
    return currentUser.permissions.includes(permission);
  }

  const isAdmin = currentUser.role==='admin';

  return (
    <AuthContext.Provider value={{currentUser, setUserRole,hasPermission,isAdmin }}>
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