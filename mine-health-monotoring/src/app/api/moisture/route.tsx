import { NextRequest, NextResponse } from "next/server";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

type NoiseData = {
    soil_sensor: number;
    createdAt: Date;
    alertType?: string;
};

export async function GET(req:NextRequest,res:NextResponse){
    try{
        let overallNoiseValue: any[] = []
        let riskZoneValue: any[] = []

        const { searchParams } = new URL(req.url);
        let seachText = searchParams.get('seachText');


        const noisedata: NoiseData[] = await prisma.sensor_information.findMany({
            where:{
                createdAt:{
                    gte: seachText ? new Date(seachText) : new Date()
                }
            },
            select:{
                soil_sensor:true,
                createdAt:true
            }
        })

        noisedata.forEach((value) => {
          if (value.soil_sensor > 0) {
            value["alertType"] = value.soil_sensor > 100 ? "High" : value.soil_sensor > 80 ? "Medium" : "Low"
            overallNoiseValue.push(value);
          }
          if (value.soil_sensor >= 40) {
            riskZoneValue.push(value);
          }
        });
        
        let response = {
            "overallNoiseValue":overallNoiseValue,
            "riskZoneValue": riskZoneValue
        }

        return NextResponse.json(response,{status:200})
    }
    catch(error){
        console.log(error)
        return NextResponse.json({error:error},{status:500})
    }
}