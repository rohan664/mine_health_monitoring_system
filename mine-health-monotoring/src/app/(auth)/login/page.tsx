'use client'
import { UserRound,LockKeyhole,Eye,EyeOff} from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { SwiperSlides } from '@/app/components/swiper';
import { useRouter } from 'next/navigation'
import { APIURL, USERAUTHENTICATION } from '@/app/utils/config';
import { fetchDetails } from '@/app/utils/utils';
import { Toast } from 'primereact/toast';
import Cookies from 'js-cookie'

export default function Home() {

  const router = useRouter()
  const toast = useRef<Toast>(null)

  useEffect(() => {
    let token = localStorage.getItem("token");
    if(token){
      router.push('/dashboard');
    }
  }, []);

  const [username, setUsername] = useState({ 
      name:"",
      error:false,
  });

  const [password, setPassword] = useState({
      password:"",
      error:false,
      isShowPassword:false
  });

  const [rememberMe, setRememberMe] = useState(false);
  
  const login = async () => {
    if(!username.name){
      setUsername({...username,error:true})
    }
    else if(!password.password){
      setPassword({...password,error:true})
    }
    else{
        let base64encode = btoa(username.name+":"+password.password)
        let url = new URL(USERAUTHENTICATION,APIURL);
        url.searchParams.append('credentials', base64encode);
        url.searchParams.append('rememberMe', rememberMe.toString());
        let resposne = await fetchDetails(url.toString(),"GET");
        if (resposne.status !== 200) {
          toast?.current?.show({severity:'error', summary: 'Error', detail:resposne?.data?.MESSAGE, life: 3000,className:'gap-4'});
        }
        else {
          await Cookies.set('token', resposne?.data?.TOKEN, {path: '/', secure: true });
          router.push('/dashboard');
        } 
  }
}

  const handlePassword = (value:boolean) => {
    setPassword({...password,isShowPassword:value})
  }
  
  return (
    <div className="flex items-center justify-center w-screen md:h-screen flex-col md:flex-row" suppressHydrationWarning>
      <Toast ref={toast}/>
      <div className="md:w-3/5 w-screen h-screen p-4">
          <div className="bg-white text-foreground w-full rounded-[1.5rem] h-full">
            <SwiperSlides/>
          </div>
      </div>
     
      <div className="w-screen md:w-2/5 h-screen p-12">
        <div className="text-foreground flex justify-center w-full h-full flex-col gap-12">
          <div className="flex flex-col">
              <h1 className="font-bold text-3xl">Welcome Back At <span className="text-red-500">Medisens</span>,</h1>
              <p>Real-time insights for a healthier you.</p>
          </div>
          <div className="flex flex-col w-full gap-12">
            <div className="flex flex-col gap-12 w-full">
              <div className="flex flex-col gap-4">
                <div className={`flex w-full items-center border-b-2 cursor-pointer ${username.error && "border-secondaryDark"}`}>
                  <UserRound color={username.error ? "#e63946" : "#000000"}/>
                  <input className={`outline-none p-2 bg-transparent w-full ${username.error && "placeholder:text-secondaryDark font-bold"}`} placeholder="Enter your username" value={username.name} onChange={(e)=>{setUsername({name:e.target.value,error:false})}}/>
                </div>
                <div className={`flex w-full items-center border-b-2 cursor-pointer ${password.error && "border-secondaryDark"}`}>
                  <LockKeyhole color={password.error ? "#e63946" : "#000000"}/>
                  <input className={`outline-none p-2 bg-transparent w-full border-none ${password.error && "placeholder:text-secondaryDark font-bold"}`}  placeholder="Enter your password" type={password.isShowPassword ? "text":"password"} value={password.password} onChange={(e)=>{setPassword({...password,password:e.target.value,error:false})}}/>
                  {password.isShowPassword ? <Eye onClick={()=>{handlePassword(false)}}/> : <EyeOff onClick={()=>{handlePassword(true)}}/>}
                </div>  
              </div>
              <div className="flex flex-col gap-4"> 
                <div className="flex w-full flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input className="cursor-pointer" type="checkbox" id="remember" name="remember" onChange={(e)=>{setRememberMe(e.target.checked)}}/>
                    <label className="cursor-pointer" htmlFor="remember"> Remember Me</label>
                  </div>
                  <div className="">
                    <p className="cursor-pointer hover:text-primaryDark">Forgot Password?</p>
                  </div>
                </div>
                <div className="w-full">
                  <button className="p-2 bg-primaryDark text-white rounded-md w-full"  onClick={()=>{login()}}>Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   </div> 
  );
}