import {PrismaClient} from '@prisma/client'
import {NextRequest, NextResponse} from 'next/server'

const prisma = new PrismaClient({});

export async function GET(req:NextRequest, res:NextResponse) {
    try {
        let response_body: { bpm?: number | null; spo2?: number | null; noise_sensor?: number | null } = {}
        const data = await prisma.user_helath_details.aggregate({ 
            _avg : {
                bpm:true,
                spo2:true
            }
        })
        // call sensor table to get the values
        let noise_data = await prisma.sensor_information.aggregate({
            _avg:{
                noise_sensor:true
            }
        })

        response_body = Object.assign(data?._avg,noise_data?._avg)
        let modifiedObject = {
            "SPO2": response_body["spo2"],
            "BPM": response_body["bpm"],
            "NOISE": response_body["noise_sensor"]
        }

        // get riskzone data from user_alert_table 
        let riskZone = await prisma.user_helath_details.findMany({
            where:{
                spo2:{
                    gte:50
                },
                bpm:{
                    gte:50
                }
            },
            select:{
                emp_id:true,
                name:true,
                spo2:true,
                bpm:true
            }
        })
        let response = {
            "overall_data":modifiedObject,
            "risk-zone":riskZone
        }
        return NextResponse.json(response,{status:200})
    }
    catch(err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}

export async function POST(req:NextRequest,res:NextResponse){
    try{
        let data = await req.json()   
        let bpmData: number[] = []
        let spo2Data: number[] = []
        let responseData = []
        let graphData = await prisma.user_helath_details.findMany({
            where:{
                createdAt:{
                    gt: new Date(data["from_datetime"]), 
                    lt: new Date(data["to_datetime"]),
                }
            },
            select:{
                bpm:true,
                spo2:true
            }
        })
        graphData.forEach((value)=>{
            bpmData.push(value.bpm ?? 0)
            spo2Data.push(value.spo2 ?? 0)
        })
        responseData.push({"name":"BPM","data":bpmData},{"name":"Spo2","data":spo2Data})

        return NextResponse.json({ responseData }, { status: 200 });
    }
    catch(err){
        return NextResponse.json({ error: err }, { status: 500 });
    }
}

