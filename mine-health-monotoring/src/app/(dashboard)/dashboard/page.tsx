'use client'
import Image from 'next/image';
import { overallInformation } from '@/app/utils/constants';
import { useEffect, useRef, useState } from 'react';
import { Insights } from '@/app/components/graph/insights';
import { Accordion, AccordionTab } from 'primereact/accordion';
import dummyUser from '@/app/assest/svg/dummy-user.svg'
import spo2Icon from "@/app/assest/svg/spo2-icon.svg"
import BpmIcon from "@/app/assest/svg/bpm-icon.svg"
import { fetchDetails } from '@/app/utils/utils';
import { APIURL, DASHBOARDDETAILS } from '@/app/utils/config';
import { Toast } from 'primereact/toast';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Flex, Spin } from 'antd';

const { RangePicker } = DatePicker;


// Status Classes for Tailwind Styling
const statusClasses: { [key: string]: { bg: string; font: string } } = {
  normal: { bg: 'bg-green-100', font: 'text-green-600' },
  medium: { bg: 'bg-yellow-100', font: 'text-orange-600' },
  high: { bg: 'bg-red-100', font: 'text-red-800' },
};

interface InsightData {
    name:string,
    data:number[]
}

interface DropdownData {
    value: string,
    label: string
}

interface overallInfo {
  name:string,
  icon:string,
  bg:string,
  color:string,
  status:string,
  value:number,
  unit:string
}

interface RiskDetail {
  name: string;
  spo2: number;
  bpm: number;
}

type PickerType = 'time' | 'date' | 'week';


export default function Dashboard() {
  
  const toast = useRef<Toast>(null)
  
  const [insight, SetInsight] = useState<InsightData[]>([])
  const [axisData,setAxisData] = useState<string[]>(['2018-09-19T00:00:00.000Z', '2018-09-19T01:30:00.000Z', '2018-09-19T02:30:00.000Z', '2018-09-19T03:30:00.000Z', '2018-09-19T04:30:00.000Z', '2018-09-19T05:30:00.000Z', '2018-09-19T06:30:00.000Z'])

  const [loading,setLoading] = useState<boolean>(true)
  
  const [dropdownData, setDropdownData] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs(),dayjs().add(7,'day')]);
  const [updatedInfo,setUpdatedInfo] = useState<overallInfo[]>([])
  const [type, setType] = useState<PickerType>('date');
  
  const [riskDetails,setRiskDetails] = useState<RiskDetail[]>([])

    useEffect(() => { 
      // get overall data for dashbaord
      const fetchData = async () => {
        let url = new URL(DASHBOARDDETAILS,APIURL);
        let response = await fetchDetails(url.toString(), "GET");
        if(response.status !== 200){
          toast?.current?.show({severity:'error', summary: 'Error', detail:response?.data?.MESSAGE, life: 3000,className:'gap-4'});
        }
        else{
          let updateOverallInformation = overallInformation.map((values) => {
            return {
              ...values,
              value: Math.floor(response?.data?.overall_data?.[values["name"]]),
              status: calculateStatus(Math.floor(response?.data?.overall_data?.[values["name"]]),values.name)
            };
          })
          setUpdatedInfo(updateOverallInformation)
          setRiskDetails(response?.data?.["risk-zone"])
          setLoading(!loading)
        }
      };
      fetchData();
    }, [])

    useEffect(()=>{
      const fetchGraphData = async () => {
        let body = {
          "from_datetime":dropdownData?.[0]?.toISOString(),
          "to_datetime":dropdownData?.[1]?.toISOString()
        }
        if(!(body?.from_datetime && body?.to_datetime  && body?.from_datetime < body?.to_datetime)){
          toast?.current?.show({severity:'error', summary: 'Error', detail:"Invalid Date", life: 3000,className:'gap-4'});
        }
        else{
          let url = new URL(DASHBOARDDETAILS,APIURL);
          let response = await fetchDetails(url.toString(), "POST",body);
          SetInsight(response.data.responseData)

        }
      }
      fetchGraphData()
    },[dropdownData])

    function calculateStatus(value:number,factor:string){
        let status = ""
        if(factor === "NOISE"){
          status = value > 100 ? "high" : value > 50 ? "medium" : "normal"
        }
        else if(factor == "SPO2"){
          status = value > 100 ? "high" : value > 50 ? "medium" : "normal"
        }
        else {
          status = value > 100 ? "high" : value > 50 ? "medium" : "normal"
        }
        return status
    }


  return (
    <div className="flex gap-6 flex-col">
      <Toast ref={toast}/>
      <div className={`w-full ${loading ? "flex": "grid lg:grid-cols-3 gap-8 auto-cols-auto"}"`}>
        { loading ? <div className="w-full flex items-center justify-center"><Spin size="large" /></div> : updatedInfo.map((value,index) => (
          <div className="bg-white p-4 rounded-lg flex gap-4 flex-col" key={index}>
            <div className="flex items-center gap-4">
              <div className="flex w-full items-center gap-2">
                <div className="p-2 px-4 rounded-md h-12 flex items-center" style={{ backgroundColor: value.color }}>
                  <Image src={value.icon} alt="noise" loading="lazy" />
                </div>
                <p className="font-bold">Overall {value.name}</p>
              </div>
              <div className={`px-4 rounded font-bold ${statusClasses[value.status]?.bg} ${statusClasses[value.status]?.font}`}>
                <p>{value.status.charAt(0).toUpperCase() + value.status.slice(1)}</p>
              </div>
            </div>
            <div className="flex w-full justify-between">
              <p className="font-bold text-[1rem] md:text-[3rem]">
                {value.value}<span className="text-gray-400 text-base">{value.unit}</span>
              </p>
              <Image src={value.bg} alt="bpm-background" width={250} priority />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 grid-rows-8 gap-8 w-full">
        <div className="col-span-3 lg:col-span-2 row-span-8 bg-white p-4 rounded-lg">
            <div className='flex w-full justify-between items-center'>
                <p className='text-2xl font-semibold text-violet-600'>Insights</p>
                <RangePicker value={dropdownData} onChange={(value)=>{setDropdownData(value)}}/>
            </div>
            <Insights statedata={insight} axisData={axisData}/>
        </div>
        <div className='row-span-8 bg-white p-4 rounded-lg flex flex-col gap-4 w-full col-span-3 lg:col-span-1'>
          <p className='font-extrabold text-red-700 text-2xl'>RiskZone</p>
          <div className='h-96 overflow-auto'>
              <Accordion className='flex flex-col gap-4'>
                {
                    riskDetails.map((value,index)=>(
                        <AccordionTab
                          key={index}
                          className='drop-shadow-md'
                          header={
                            <span className="flex items-center gap-2 w-full p-4">
                                <Image src={dummyUser} alt="circle" height={40}/>
                                <span className="font-bold white-space-nowrap">{value.name}</span>
                            </span>
                          }
                        >   
                        <div className='flex w-full gap-4 justify-center'>
                          <div className='flex items-center gap-2'>
                              <div className='p-2 px-4 rounded-md h-12 flex items-center bg-[#FBF0F3]'>
                                <Image src={spo2Icon} alt='spo2-icon'/>
                              </div>
                              <p className="font-bold text-[1rem] md:text-[3rem]">{value?.spo2}<span className="text-gray-400 text-base">Spo2</span></p>
                          </div>
                          <div className='flex items-center gap-2'>
                              <div className='p-2 px-4 rounded-md h-12 flex items-center bg-[#F8DEBD]'>
                                <Image src={BpmIcon} alt='bpm-icon'/>
                              </div>
                              <p className="font-bold text-[1rem] md:text-[3rem]">{value?.bpm}<span className="text-gray-400 text-base">BPM</span></p>
                          </div>
                        </div>
                      </AccordionTab>
                    ))
                }
              </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
