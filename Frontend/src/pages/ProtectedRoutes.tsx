import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner';

const ProtectedRoutes = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem('LAW_TOKEN');
  useEffect(()=>{
    if(!token){
      navigate('/')
      console.log("Token not present")
      toast.info('Authentication failed',{
        description:'Login to access data'
      })
    }
  },[token])

  return (
    <Outlet/>
  )
}

export default ProtectedRoutes