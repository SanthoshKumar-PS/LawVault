import Colors from "./pages/Colors"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoutes from "./pages/ProtectedRoutes"
import { Toaster } from "sonner"
import { FileManagerProvider } from "./contexts/FileManagerContext"
import { FileActionProvider } from "./contexts/FileActionContext"
import MainLayout from "./components/layout/MainLayout"
import Recents from "./pages/Recents"
import Access from "./pages/Access"
import Profile from "./pages/Profile"
const App = () => {
  return (
    <>
    <Toaster 
      position="bottom-center"
      expand={true}
      visibleToasts={2}
      richColors 
      duration={3000}
      toastOptions={{
        classNames:{
          success:'!bg-blue-500 !text-white !border-blue-600',
          error:'!bg-red-500 !text-white !border-red-600',
          info:'!bg-blue-400 !text-white',
          description:'group-[.success]:text-blue-100 group-[.error]:text-red-100'
        }
      }}
    />
    <AuthProvider>
      <BrowserRouter>
        <FileManagerProvider>
          <FileActionProvider>          
            <Routes>
              <Route path ="/" element={<Login/>}/>
              <Route path="/dashboard" element={<ProtectedRoutes/>}>
                <Route element={<MainLayout/>}>
                  <Route path="home" element={<Home/>}/>
                  <Route path="recents" element={<Recents/>}/>
                  <Route path="access" element={<Access/>}/>
                  <Route path="profile" element={<Profile/>}/>
                  <Route path="colors" element={<Colors/>}/>
                </Route>
              </Route>
              
            </Routes>
          </FileActionProvider>
        </FileManagerProvider>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App


