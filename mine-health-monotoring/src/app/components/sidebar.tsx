'use client'
import { HeartHandshake,LogOut  } from 'lucide-react';
import { LOGOUT, sidebarNavigations } from "@/app/utils/constants"
import { Tooltip } from 'primereact/tooltip';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export const Sidebar = () => {
    const router = useRouter()
    const handleNavigations = (url:string) => {
        router.push(url)
    }

    const logout = () => {
        Cookies.remove("token")
        router.push("/login")
    }

    return (
        <div className='flex flex-col justify-between h-full'>
            <div className="flex flex-col items-center gap-10">
                <div className="">
                    <HeartHandshake size={50} color='#d90429'/>
                </div>
                <div className='flex gap-8 flex-col'>
                {
                    sidebarNavigations.map((value, index) => (
                        <div key={index}>
                            <Tooltip 
                                target={`.custom-target-${index}`} 
                                content={value.name} 
                                className="custom-tooltip" 
                            />

                            <div className={`custom-target-${index} cursor-pointer`} onClick={()=>{handleNavigations(value.route)}}>
                                {value.img}
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>
            <div className='flex items-center justify-center w-full'>
                <div className='cursor-pointer'> 
                    <Tooltip target=".sign-out" content={LOGOUT} className="custom-tooltip" />
                    <LogOut size={25} className='sign-out' onClick={logout}/>
                </div>
            </div>
        </div>
    )
}