'use client'
import { SoilMoisture } from "@/app/components/graph/soilmoisture";
import { Switch } from 'antd';
import { useEffect, useRef, useState } from "react";
import type { Dayjs } from 'dayjs';
import { Siren } from 'lucide-react';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from "dayjs";
import CustomTable from "@/app/components/table";
import { fetchDetails } from "@/app/utils/utils";
import { APIURL, SENSORINFO } from "@/app/utils/config";
import { Toast } from 'primereact/toast';

interface tableData {
    key: string,
    srno:number,
    datetime: string,
    sensorValue: number,
    alertType: string,
}

interface riskzone {
    soil_sensor:number,
    createdAt:string,
    alert_type:string
}

export default function Moisture () {
    const toast = useRef<Toast>(null)
    const [liveData,setLiveData] = useState<boolean>(false)
    const [date,setDate] = useState<Dayjs | null>(dayjs().startOf("day"))
    const [tableData,setTableData] = useState<tableData[]>([]);
    const [riskZone,setRiskZone] = useState<riskzone[]>([])

    useEffect(()=>{
        getSoilSensorInfo()
    },[date])

    const getSoilSensorInfo = async () => {
        let url = new URL(SENSORINFO,APIURL);
        url.searchParams.append('seachText', date?.toString() ?? "");
        let response = await fetchDetails(url.toString(), "GET");
        if(response.status !== 200){
            toast?.current?.show({severity:'error', summary: 'Error', detail:response?.data?.MESSAGE, life: 3000,className:'gap-4'});
        }
        else{
            setRiskZone(response?.data?.riskZoneValue)
            let tableFormatData = response.data.overallNoiseValue.map((value:tableData,index:number)=>({...value,key:index+1,srno:index+1}))
            setTableData(tableFormatData)
           
        }
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(date)
    };
    
    return(
        <div className="flex flex-col w-full h-full gap-4">
            <Toast ref={toast}/>
            <div className="grid grid-cols-3 gap-4 auto-cols-auto">
                <div className="col-span-2 bg-white rounded-md p-4">
                    <div className="flex w-full justify-between">
                        <p className="text-2xl font-semibold text-violet-600">Real-time Soil Moisture</p>
                        <Switch checkedChildren="Live" unCheckedChildren="" onChange={(e)=>{setLiveData(!liveData)}} defaultValue={liveData} className="outline outline-offset-2 outline-2 outline-blue-500"/>
                    </div>
                    <SoilMoisture liveData={liveData}/>
                </div>
                <div className="col-span-1 rounded-md p-4 bg-gradient-to-b from-red-200 via-white-300 to-red-400">
                    <p className="font-extrabold text-red-700 text-2xl">Alert Notifications</p>
                    <div className="py-4 h-80 overflow-auto flex gap-4 flex-col">
                        {
                            riskZone.map((value,index)=>(
                                    <div className="bg-[#fbf5f3] p-2 flex items-center rounded-lg" key={index}>
                                        <Siren color="#d91e36" size={40}/>
                                        <div className="px-4 flex w-full justify-between">
                                            <div className="">
                                                <p><span className="text-black font-bold">Time:</span>{new Date(value.createdAt).toISOString().split("T")[1].split(".")[0]}</p>
                                                <p className="font-extrabold text-orange-400"><span className="text-black font-bold">Sensor Value:</span>{value.soil_sensor}</p>
                                            </div>
                                            <div className="">
                                                <p><span className="text-black font-bold">Date:</span> {new Date(value.createdAt).toISOString().split("T")[0]}</p>
                                            </div>
                                        </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="bg-white p-4">
                <div className="flex justify-between p-4">
                    <p className="text-xl font-bold">Historical Data</p>
                    <DatePicker onChange={onChange} defaultValue={date}/>
                </div>
                <div>
                    <CustomTable data={tableData}/>
                </div>
            </div>
        </div>
    )
}