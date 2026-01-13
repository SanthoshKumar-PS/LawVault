import { useEffect, useState } from "react"
import { replace, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Scale } from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";

const Login = () => {
    const [email, setEmail] = useState<string>('santhosh@gmail.com');
    const [password, setPassword] = useState<string>('Santhosh');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {currentUser,setCurrentUser} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        console.log("Current User: ",currentUser)
    },[currentUser])
    const handleLogin = async (e?:React.FormEvent) => {
         e?.preventDefault();
         if(!email) return toast.error('Enter valid email to login')
         if(!password) return toast.error('Enter your password to login')
        try{
            const response = await api.post('/login',{
                email,
                password
            });
            setCurrentUser(response.data.user)
            localStorage.setItem('LAW_TOKEN',response.data.token)
            navigate('/home', {replace:true})

            console.log(response.data)

        } catch(error:any){
            console.error('Login error context: ',error);
            const serverMessage = error.response?.data.message || error.response?.data;
            const errorMessage = serverMessage || "Something went wrong"
            if(error.response?.status===401){
                toast.error('Unauthorized', {description:'Invalid email or password'})
            }else if (error.response?.status === 409) {
                toast.error("Conflict", { description: "User already exists" });
            } else {
                toast.error("Login Failed", { 
                    description: errorMessage || "Please try again later" 
                });
            }

        }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.5}}
            className="w-full max-w-md"
        >
            {/* Logo & Title */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{scale:0.8}}
                    animate={{scale:1}}
                    transition={{delay:0.2, type:'spring', stiffness:200}}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4"
                >
                    <Scale className="h-8 w-8 text-primary-foreground"/>
                </motion.div>
                <h1 className="text-3xl font-bold text-foreground mb-2">LawVault</h1>
                <p className="text-muted-foreground">Secure document management for legal professionals</p>
            </div>

            {/* Login Card */}
            <motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{delay:0.3, duration:0.5}}
                className="bg-card border border-border rounded-2xl p-8 shadow-lg"
            >
                <h2 className="text-xl font-semibold text-foreground mb-6">Sign in to your account</h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor='email'>Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@lawvault.com"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                id="password"
                                type={showPassword?'text':'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={()=>setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size='lg'>
                        Sign in
                    </Button>
                </form>

                {/* Contact Admin */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Don't have an account?{' '}
                    <span className="text-primary hover:underline font-medium">Contact admin</span>

                </p>

            </motion.div>

        </motion.div>
    </div>
  )
}

export default Login