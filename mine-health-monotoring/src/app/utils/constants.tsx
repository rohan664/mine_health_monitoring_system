import healthMonitor from '@/app/assest/images/health_monitor.png'
import soilMoisture from '@/app/assest/images/soil_moisture.png'
import exportBusiness from  '@/app/assest/images/export.png'
import dashboard from '@/app/assest/images/dashboard.png'
import { LayoutDashboard,Activity,Droplets,ChartColumnBig   } from 'lucide-react';
import BpmIcon from "@/app/assest/svg/bpm-icon.svg"
import BpmBackground from "@/app/assest/svg/bpm.svg"
import spo2Icon from "@/app/assest/svg/spo2-icon.svg"
import spo2background from "@/app/assest/svg/SP02.svg"
import noiseIcon from "@/app/assest/svg/audio-lines.svg"
import noisebackground from "@/app/assest/svg/noise.svg"

export const swiperSlides = [
    {
        title:"Ensuring Worker Safety",
        description:"Monitor vital health parameters of mine workers in real-time to prevent health risks and enhance workplace safety.",
        images:healthMonitor
    },
    {
        title:"Preventing Flood Disasters",
        description:"Monitor vital health parameters of mine workers in real-time to prevent health risks and enhance workplace safety.",
        images:soilMoisture
    },
    {
        title:"Securing Valuable Resources",
        description:"Monitor and safeguard coal reserves against theft using advanced tracking systems.",
        images:exportBusiness
    },
    {
        title:"Insights That Drive Action",
        description:"Leverage machine learning to predict and prevent issues, ensuring a smarter and safer environment.",
        images:dashboard

    }
]

export const sidebarNavigations = [
    {
        name:"Dashboard",
        img: <LayoutDashboard size={30}/>,
        route:'/dashboard'
    },
    {
        name:"Monitoring",
        img: <Activity  size={30}/>,
        route:'/monitor'
    },
    {
        name:"Soil Moisture",
        img: <Droplets  size={30}/>,
        route:'/moisture'
    },
    {
        name:"Analytics",
        img: <ChartColumnBig size={30}/>,
        route:'/analytics'
    },

]

export const overallInformation = [
    {
        name:'BPM',
        icon:BpmIcon,
        bg:BpmBackground,
        color:'#F8DEBD',
        status:"normal",
        unit:"BPM"
    },
    {
        name:'SPO2',
        icon:spo2Icon,
        bg:spo2background,
        color:"#FBF0F3",
        status:"medium",
        unit:"SPO2"
    },
    {
        name:'NOISE',
        icon:noiseIcon,
        bg:noisebackground,
        color:"#D0FBFF",
        status:"high",
        unit:'DPM'
    }
]

export const SALT_ROUNDS = 10
export const LOGOUT = "Logout"
export const MESSAGES = 'message'
export const STATUS  = 'status'
export const TOKEN = 'token'