import Colors from "./pages/Colors"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoutes from "./pages/ProtectedRoutes"
const App = () => {
  return (
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
  )
}

export default App


