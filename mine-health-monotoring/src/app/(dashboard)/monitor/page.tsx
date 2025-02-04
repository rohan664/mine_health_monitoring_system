'use client'
import React, { useEffect, useRef, useState } from "react"
import { Search, CircleChevronRight,UserPen,RotateCw } from 'lucide-react';
import Image from "next/image";
import spo2Icon from "@/app/assest/svg/spo2-icon.svg"
import BpmIcon from "@/app/assest/svg/bpm-icon.svg"
import { Sidebar } from 'primereact/sidebar';
import weightCalculator from '@/app/assest/svg/weight_calculator.svg'
import humanBody from '@/app/assest/svg/human_body.svg'
import { Toast } from 'primereact/toast';
import GradientSlider from "@/app/components/gradient";
import { APIURL, EMPLOYEEDETAILS } from "@/app/utils/config";
import { fetchDetails } from "@/app/utils/utils";
import { Dialog } from 'primereact/dialog';
import firestore from "@/firebaseConfig.mjs";
import { setDoc,doc } from "firebase/firestore";
import { Tooltip } from 'primereact/tooltip';

interface userDeatils {
    bpm : number 
    emp_id : string 
    height : number 
    name : string 
    spo2 : number 
    weight : number
    chest: number
    waist: number
}

interface currentUser {
    height : number 
    weight : number
    chest : number
    waist : number
}

export default function Monitor(){

    const toast = useRef<Toast>(null)
    const[search,setSerach] = useState<string>()
    const [visible, setVisible] = useState(false);
    const [addPopup,setAddPopup] = useState(false)
    const [employeeDetails,setEmployeeDetails] = useState<userDeatils[]>([])
    const [currentUser,setCurrentUser] = useState<currentUser>()
    const [EmployeeName,setEmployeeName] = useState({ value:"", error:"" })
    const [EmployeeId,setEmployeeId] = useState({ value:"", error:"" })
    const [EmployeeWeight,setEmployeeWeight] = useState({ value:"", error:"" })
    const [EmployeeHeight,setEmployeeHeight] = useState({ value:"", error:"" })
    const [EmployeeChest,setEmployeeChest] = useState({ value:"", error:"" })
    const [EmployeeWaist,setEmployeeWaist] = useState({ value:"", error:"" })
    const [mandatoryField,setMandatoryField] = useState(false)
    const [buttonValue,setButtonValue] = useState<string>("Add")


    useEffect(()=>{
        getEmployeeDetails()
    },[])

    async function getEmployeeDetails() {
        let url = new URL(EMPLOYEEDETAILS,APIURL);
        url.searchParams.append('seachText', search ?? "");
        let response = await fetchDetails(url.toString(), "GET");
        if(response.status !== 200){
            toast?.current?.show({severity:'error', summary: 'Error', detail:response?.data?.MESSAGE, life: 3000,className:'gap-4'});
        }
        else{
            console.log(response)
            setEmployeeDetails(response.data)
        }
    }

    const validateAlphanumeric = (value:string) => {
        const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
        const isAlphanumeric = alphanumericRegex.test(value);
        return isAlphanumeric
    }

    const numerice = (value:string) => {
        const numericRegex = /^\d+$/;
        const isNumeric = numericRegex.test(value); // true
        return isNumeric
    }

    const clearEmployeeDetails = () => {
        setEmployeeChest({value:"",error:""})
        setEmployeeHeight({value:"",error:""})
        setEmployeeName({value:"",error:""})
        setEmployeeId({value:"",error:""})
        setEmployeeWeight({value:"",error:""})
        setEmployeeWaist({value:"",error:""})
        setMandatoryField(false)
        setButtonValue("Add")
    }

    const EmployeeDetails = (value:string, checked:string, setFunction:React.Dispatch<React.SetStateAction<{ value: string; error: string; }>>, currentValue:{ value: string; error: string; }) => {
        if(value){
            setMandatoryField(false)
            let isValid = checked === "alphanumeric" ? validateAlphanumeric(value) : numerice(value)
            if(isValid){
                setFunction({...currentValue,value:value,error:""})
            }
            else{
                setFunction({...currentValue,value:value,error:checked === "alphanumeric" ? "Only Alphanumeric are allowed":"Only numeric are allowed" })
            }
        }
        else{
            setFunction({...currentValue,value:"",error:""})
        }
    }

    const addEmployeeDetails = async() => {
        if(!(EmployeeName.value && EmployeeId.value && EmployeeWeight.value && EmployeeHeight.value)){
            setMandatoryField(!mandatoryField)
        }
        else{
            let request_body = {
                "employee_name":EmployeeName.value.split(" ").map((value)=>(value.charAt(0).toUpperCase() + value.slice(1))).join(" ").trim(),
                "employee_id":EmployeeId.value.trim(),
                "weight":+EmployeeWeight.value.trim(),
                "height":+EmployeeHeight.value.trim(),
                "chest":+EmployeeChest.value.trim(),
                "waist":+EmployeeWaist.value.trim(),
                "bmi":+(+EmployeeWeight.value / Math.pow(+EmployeeHeight.value / 100, 2))
            }
            let url = new URL(EMPLOYEEDETAILS,APIURL);
            let resposne = await fetchDetails(url.toString(),"POST",request_body);
            console.log(resposne)
            if(resposne.status !== 200){
                toast?.current?.show({severity:'error', summary: 'Error', detail:resposne?.data?.MESSAGE, life: 3000,className:'gap-4'})
            }
            else {
                toast?.current?.show({severity:'success', summary: 'Success', detail:resposne?.data?.MESSAGE, life: 3000,className:'gap-4'})
                setAddPopup(!addPopup)
                getEmployeeDetails()
                // setting up the collection in firestore
                await  setDoc(doc(firestore,"users",EmployeeId.value.trim()),{
                    BPM:0,
                    SPO2:0
                });
            }
        }
    }

    const setUpdateEmployeeDetails = async (currentValue:userDeatils) => {
        setButtonValue("Update")
        setEmployeeName({...EmployeeName,value:currentValue.name})
        setEmployeeId({...EmployeeId,value:currentValue.emp_id})
        setEmployeeWeight({...EmployeeWeight,value:String(currentValue.weight)})
        setEmployeeHeight({...EmployeeHeight,value:String(currentValue.height)})
        setEmployeeWaist({...EmployeeWaist,value:String(currentValue.waist)})
        setEmployeeChest({...EmployeeChest,value:String(currentValue.chest)})
    }

    const updateEmployeeDeatails = async () => {
        if(!(EmployeeName.value && EmployeeId.value && EmployeeWeight.value && EmployeeHeight.value)){
            setMandatoryField(!mandatoryField)
        }
        else{
            let request_body = {
                "employee_name":EmployeeName.value.split(" ").map((value)=>(value.charAt(0).toUpperCase() + value.slice(1))).join(" ").trim(),
                "employee_id":EmployeeId.value.trim(),
                "weight":+EmployeeWeight.value.trim(),
                "height":+EmployeeHeight.value.trim(),
                "chest":+EmployeeChest.value.trim(),
                "waist":+EmployeeWaist.value.trim(),
            }
            let url = new URL(EMPLOYEEDETAILS,APIURL);
            let resposne = await fetchDetails(url.toString(),"PUT",request_body);
            console.log(resposne)
            if(resposne.status !== 200){
                toast?.current?.show({severity:'error', summary: 'Error', detail:resposne?.data?.MESSAGE, life: 3000,className:'gap-4'})
            }
            else {
                toast?.current?.show({severity:'success', summary: 'Success', detail:resposne?.data?.MESSAGE, life: 3000,className:'gap-4'})
                setAddPopup(!addPopup)
                getEmployeeDetails()
                clearEmployeeDetails()
            }
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            getEmployeeDetails()
        }, 500);
    
        return () => clearTimeout(timer);
      }, [search]);

    return (
        <div className="w-full h-full flex gap-4 flex-col">
        <Toast ref={toast}/>
           <div className="flex w-full  justify-end items-end gap-4">
                <div className="flex bg-white rounded-lg p-2 shadow-md shadow-gray-400/75">
                    <input placeholder="Search by Employee ID" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSerach(e.target.value); }} className="bg-transparent outline-none border-none lg:w-60"/>
                    <Search/>
                </div>
                <div className="bg-slate-500 text-white px-4 h-full rounded-lg flex items-center cursor-pointer" onClick={()=>{setAddPopup(!addPopup)}}>
                    <p>Add Employee</p>
                </div>
                <div className="flex items-center h-full">
                    {/* <Tooltip target=".refresh" content={"Refresh"} className="custom-tooltip" /> */}
                    <RotateCw className="refresh cursor-pointer" onClick={()=>{getEmployeeDetails()}}/>
                </div>
           </div>
           <div className="grid w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-cols-auto">
                {
                    employeeDetails.map((value,index)=> (
                        <div className="bg-white rounded-md p-4 shadow-sm hover:shadow-2xl shadow-gray-400" key={index}>
                            <div className="w-full flex items-center gap-2 mb-5">
                                <div className="text-center flex-1 border-r-2 border-gray-300">
                                    <p className="font-extrabold text-gray-500">Employee ID</p>
                                    <p className="text-blue-950 font-bold text-lg">{value.emp_id}</p>
                                </div>
                                <div className="text-center flex-1 w-full">
                                    <p className="font-extrabold text-gray-500">Employee Name</p>
                                    <p className="text-nowrap overflow-hidden text-ellipsis w-40">{value.name}</p>
                                </div>
                            </div>
                            <hr/>
                            <div className="p-2 flex gap-3 flex-col mb-5">
                                <p className="text-sm">Health Parameters</p>
                                <div className="flex gap-4 items-center justify-center">
                                    <div className='flex items-center gap-2'>
                                        <div className='p-2 w-12 px-4 rounded-md h-12 flex items-center bg-[#FBF0F3]'>
                                            <Image src={spo2Icon} alt='spo2-icon'/>
                                        </div>
                                        <p className="font-bold text-[1rem] md:text-[2rem]">{value.spo2 ?? 0}<span className="text-gray-400 text-base">Spo2</span></p>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <div className='p-2 w-12 px-4 rounded-md h-12 flex items-center bg-[#F8DEBD]'>
                                            <Image src={BpmIcon} alt='spo2-icon'/>
                                        </div>
                                        <p className="font-bold text-[1rem] md:text-[2rem]">{value.bpm ?? 0}<span className="text-gray-400 text-base">BPM</span></p>
                                    </div>

                                </div>
                            </div>
                            <hr/>
                            <div className="pt-2 flex justify-between">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <UserPen color="#03045e" size={20} onClick={()=>{setAddPopup(!addPopup),setUpdateEmployeeDetails(value)}}/>
                                    <p className="text-sm text-yellow-600">Edit Details</p>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <p className="text-sm text-yellow-600">More Details</p>
                                    <CircleChevronRight color="#03045e" size={20} onClick={()=>{setVisible(true),setCurrentUser({ height: value.height, weight: value.weight, chest: value.chest, waist:value.waist })}}/>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="card flex justify-content-center">
                <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} className="p-4 bg-gray-900 w-[30rem]">
                    <p className="text-white">BMI Calculator</p>
                    <div className="grid grid-cols-2 pt-2 gap-4">
                        <div className="flex flex-1 flex-col gap-4">
                            <div className="bg-[#F8DEBD] rounded-lg flex flex-col p-2 gap-2">
                                <div className="flex justify-end">
                                    <Image src={weightCalculator} alt="weight calculator"/>
                                </div>
                                <div className="flex gap-4 relative">
                                    <p className="text-sm">Weight</p>
                                    <p className='absolute right-10 -top-1 font-bold'>{`${currentUser?.weight ?? 0} KG`}</p>
                                </div>
                            </div>
                            <div className="bg-[#D0FBFF] rounded-lg flex flex-col p-2 gap-2">
                                <div className="flex justify-end">
                                    <Image src={weightCalculator} alt="weight calculator"/>
                                </div>
                                <div className="flex gap-4 relative">
                                    <p className="text-sm">Height</p>
                                    <p className='absolute right-10 -top-1 font-bold'>{`${currentUser?.height ?? 0} CM`}</p>
                                </div>
                            </div> 
                        </div>
                        <div className="flex-1 h-full">
                            <div className="bg-[#4A4949] text-white rounded-lg flex flex-col p-2 h-full">
                                <p className="text-sm">Body Mass Index(BMI)</p>
                                <div className="flex w-full justify-between pt-4">
                                        <p className="text-2xl font-bold">23.9</p>
                                </div>
                                <GradientSlider min={15} max={40} initialValue={25} />
                            </div> 
                        </div>
                    </div>
                    <hr className="my-5"/>
                    <div className="text-white py-4">
                        <p className="text-lg">Body Measurements</p>
                        <div className="flex justify-around w-full">
                            <div className="flex flex-col gap-4 justify-center">
                                <div className="bg-white py-2 px-4 rounded-lg text-black text-center">
                                    <p className="text-sm">Chest (in)</p>
                                    <p className="text-lg font-extrabold">{currentUser?.chest ?? 0}</p>
                                </div>
                                <div className="bg-white p-2 rounded-lg text-black text-center">
                                    <p className="text-sm">Waist (in)</p>
                                    <p className="text-lg font-extrabold">{currentUser?.waist ?? 0}</p>
                                </div>
                            </div>
                            <div className="">
                                <Image src={humanBody} alt="human-body" priority={true}/>  
                            </div>
                        </div>  
                    </div>
                </Sidebar>
            </div>
            <div>
                <Dialog visible={addPopup} className="w-full md:w-[40rem]" onHide={() => {setAddPopup(!addPopup),clearEmployeeDetails()}}>
                    <div className="flex  w-full h-full flex-col p-2">
                        <p  className="text-center font-bold text-lg">Add Employee Details</p>
                        <div className="p-8 flex gap-4 flex-col">
                            <div className="flex flex-col gap-2">
                                <label>Name of the Employee: <sup className="text-red-600">*</sup></label>
                                <input placeholder="Enter Name" className="border-2 border-gray-200 rounded-lg p-2 outline-none" value={EmployeeName.value} onChange={(e)=>{EmployeeDetails(e.target.value,"alphanumeric",setEmployeeName,EmployeeName)}}></input>
                                <p className="text-sm text-red-600">{EmployeeName.error}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Employee ID: <sup className="text-red-600">*</sup></label>
                                <input placeholder="Enter Employee ID" className="border-2 border-gray-200 rounded-lg p-2 outline-none" value={EmployeeId.value} onChange={(e)=>{EmployeeDetails(e.target.value,"alphanumeric",setEmployeeId,EmployeeId)}}></input>
                                <p className="text-sm text-red-600">{EmployeeId.error}</p>
                            </div>
                            <div className="flex gap-2 flex-col md:flex-row">
                                <div>
                                    <label>Weight: <sup className="text-red-600">*</sup></label>
                                    <input placeholder="Enter Weight" className="border-2 border-gray-200 rounded-lg p-2 outline-none" value={EmployeeWeight.value != "null" ? EmployeeWeight.value : 0} onChange={(e)=>{EmployeeDetails(e.target.value,"numeric",setEmployeeWeight,EmployeeWeight)}}></input>
                                    <p className="text-sm text-red-600">{EmployeeWeight.error}</p>
                                </div>
                                <div>
                                    <label>Height: <sup className="text-red-600">*</sup></label>
                                    <input placeholder="Enter Height" className="border-2 border-gray-200 rounded-lg p-2 outline-none" value={EmployeeHeight.value != "null" ? EmployeeHeight.value : 0} onChange={(e)=>{EmployeeDetails(e.target.value,"numeric",setEmployeeHeight,EmployeeHeight)}}></input>
                                    <p className="text-sm text-red-600">{EmployeeHeight.error}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-col md:flex-row">
                                <div>
                                    <label>Chest:</label>
                                    <input placeholder="Enter chest" className="border-2 border-gray-200 rounded-lg p-2 outline-none" value={EmployeeChest.value != "null" ? EmployeeChest.value : 0} onChange={(e)=>{EmployeeDetails(e.target.value,"numeric",setEmployeeChest,EmployeeChest)}}></input>
                                    <p className="text-sm text-red-600">{EmployeeChest.error}</p>
                                </div>
                                <div>
                                    <label>Waist:</label>
                                    <input placeholder="Enter Waist" className="border-2 border-gray-200 rounded-lg p-2 outline-none" value={EmployeeWaist.value != "null" ? EmployeeWaist.value : 0} onChange={(e)=>{EmployeeDetails(e.target.value,"numeric",setEmployeeWaist,EmployeeWaist)}}></input>
                                    <p className="text-sm text-red-600">{EmployeeWaist.error}</p>
                                </div>
                            </div>
                            <div className="flex w-full justify-between">
                                <p className="text-sm"><span className="font-bold">Note:</span><sup className="text-red-600">*</sup> represent mandatory field</p>
                                {mandatoryField && <p className="text-sm text-red-600 font-bold">Please fill all mandatory field</p>}
                            </div>
                            <div className="flex items-center w-full justify-center">
                                <button className="bg-slate-600 text-white py-2 px-8 rounded-lg" onClick={buttonValue == "Update" ?  updateEmployeeDeatails : addEmployeeDetails}>{buttonValue}</button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}