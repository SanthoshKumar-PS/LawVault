import Colors from "./pages/Colors"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path ="/colors" element={<Colors/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App


