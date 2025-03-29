'use client'
import PredictHealth from "@/app/components/predicationHealth"
import HealthChart from "@/app/components/graph/healthChart"

const sampleData = [
    { timestamp: '2023-05-01T08:00:00', spo2: 98, bpm: 72 },
    { timestamp: '2023-05-01T08:15:00', spo2: 97, bpm: 75 },
    { timestamp: '2023-05-01T08:30:00', spo2: 96, bpm: 78 },
    { timestamp: '2023-05-01T08:45:00', spo2: 95, bpm: 82 },
    { timestamp: '2023-05-01T09:00:00', spo2: 94, bpm: 85 },
  ];

export default function Analytics(){
    return (
        <div className="w-full h-full flex flex-col gap-4">
            <PredictHealth/>
            {/* <HealthChart data={sampleData} /> */}
        </div>
       
        
    )
}