import { useState } from "react"
import Header from "../components/layout/Header"

const Home = () => {
  const [sideBarOpen,setSideBarOpen] = useState<boolean>(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick = {()=>setSideBarOpen(true)}/>
    </div>
  )
}

export default Home