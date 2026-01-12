import Colors from "./pages/Colors"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoutes from "./pages/ProtectedRoutes"
import { Toaster } from "sonner"
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
        <Routes>
          <Route path ="/" element={<Login/>}/>
          <Route path="/home" element={<ProtectedRoutes/>}>
            <Route index element={<Home/>}/>
          </Route>
          <Route path ="/colors" element={<Colors/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App


