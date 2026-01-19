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
      <FileManagerProvider>
        <FileActionProvider>
          <BrowserRouter>
            <Routes>
              <Route path ="/" element={<Login/>}/>
              <Route path="/home" element={<ProtectedRoutes/>}>
                <Route element={<MainLayout/>}>
                  <Route index element={<Home/>}/>
                  <Route path ="colors" element={<Colors/>}/>
                </Route>
              </Route>
              
            </Routes>
          </BrowserRouter>
        </FileActionProvider>
      </FileManagerProvider>
    </AuthProvider>
    </>
  )
}

export default App


