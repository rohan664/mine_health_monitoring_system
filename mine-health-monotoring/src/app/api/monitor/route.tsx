import { MESSAGES } from '@/app/utils/constants';
import { EMPLOYESS_DETAILS_SAVED_SUCCESSFULLY, INVALID_REQUEST_OBJECT,USER_EXISTS, USER_IS_NOT_PRESENT, USER_UPDATE_SUCCESSFULLY } from '@/app/utils/messages';
import {PrismaClient} from '@prisma/client'
import {NextRequest, NextResponse} from 'next/server'

const prisma = new PrismaClient({});

export async function GET(req:NextRequest, res:NextResponse) {
    try {
        const { searchParams } = new URL(req.url);
        let seachText = searchParams.get('seachText');
        let userdata
        if(seachText){
            userdata = await prisma.user_helath_details.findMany({
                where:{
                    emp_id: {
                        contains:seachText
                    }
                },
                select:{
                    emp_id:true,
                    name:true,
                    spo2:true,
                    bpm:true,
                    weight:true,
                    height:true,
                    chest:true,
                    waist:true
                }

            })
        }
        else {
            userdata = await prisma.user_helath_details.findMany({
                select:{
                    emp_id:true,
                    name:true,
                    spo2:true,
                    bpm:true,
                    weight:true,
                    height:true,
                    chest:true,
                    waist:true
                },
            })
            console.log(userdata)
        }
        return NextResponse.json(userdata,{status:200})
    }
    catch(err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}


export async function POST(req:NextRequest,res:NextResponse){
    try{
        let request_body = await req.json()
        if(!(request_body.employee_name && request_body.employee_id && request_body.weight && request_body.height)){
            return NextResponse.json({ MESSAGES: INVALID_REQUEST_OBJECT }, { status: 400 });
        }

        // check employee is already present or not
        let user = await prisma.user_helath_details.findFirst({
            where:{
                emp_id:request_body.employee_id
            }
        })

        if(user){
            return NextResponse.json({ MESSAGES: USER_EXISTS }, { status: 400 })
        }

        const newUserdetails = await prisma.user_helath_details.create({
            data:{
               emp_id:request_body.employee_id,
               name:request_body.employee_name,
               weight:request_body.weight,
               height:request_body.height,
               chest:request_body.chest,
               waist:request_body.waist,
               bmi:request_body.bmi 
            }
        })
        let response_body = {
            MESSAGE : EMPLOYESS_DETAILS_SAVED_SUCCESSFULLY,
            data:newUserdetails
        } 
        return NextResponse.json(response_body,{status:200})

    }
    catch(error){
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function PUT(req:NextRequest,res:NextResponse){
    try{

        let request_body = await req.json()
        console.log(request_body)
        if(!(request_body.employee_name && request_body.employee_id && request_body.weight && request_body.height)){
            return NextResponse.json({ MESSAGE: INVALID_REQUEST_OBJECT }, { status: 500 });
        }

        let isUserPresent = await prisma.user_helath_details.findFirst({
            where:{
                emp_id:request_body.employee_id
            }
        })

        if(!isUserPresent){
            return NextResponse.json({MESSAGE : USER_IS_NOT_PRESENT},{status:400})
        }

        let user = await prisma.user_helath_details.update({
            where:{
                emp_id:request_body.employee_id
            },
            data:{
                emp_id:request_body.employee_id,
                name:request_body.employee_name,
                weight:request_body.weight,
                height:request_body.height,
                chest:request_body.chest ?? 0,
                waist:request_body.waist ?? 0
            }
        })
        
        return NextResponse.json({MESSAGE:USER_UPDATE_SUCCESSFULLY,data:user}, { status: 200 });
    }
    catch(error){
        return NextResponse.json({ error: error }, { status: 500 });
    }
}