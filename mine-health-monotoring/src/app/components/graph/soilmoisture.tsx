import { ApexOptions } from 'apexcharts';
import { useState,useEffect } from "react";
import dynamic from "next/dynamic";
import firestore from "../../../firebaseConfig.mjs";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";

const Chart = dynamic(()=> import("react-apexcharts") , { ssr: false })

export const SoilMoisture = ({liveData}:{liveData:boolean}) => {
    const [series, setSeries] = useState<{ name: string; data: { x: number; y: number }[] }[]>([
        {
          name: "Sensor Data",
          data: [],
        },
      ]);

      const options:ApexOptions = {
        chart: {
          id: "realtime",
          type: "line",
          animations: {
            enabled: true,
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          max: 200,
          min: 0,
        },
        legend: {
          show: false,
        },
      };

    
    useEffect(() => {
        if(liveData) {
          const sensorCollection = collection(firestore, "sensors");
           onSnapshot(sensorCollection, (snapshot) => {
                snapshot.docChanges().forEach(async(change) => {
                    if(change.doc.id == 'soil-moisture'){
                        const now = new Date().getTime();
                        let sensorValue = change.doc.data().value
                        if (isValidSensorValue(sensorValue)) {
                              setSeries((prevSeries) => [
                              {
                                  ...prevSeries[0],
                                  data: [
                                  ...prevSeries[0].data.slice(-20),
                                  { x: now, y: sensorValue },
                                  ],
                              },
                              ]);
                          } else {
                              console.warn("Invalid sensor value:", sensorValue);
                          }
                    }
              
                })
                  
              }) 
        }

    }, [liveData]);



    const isValidSensorValue = (value:number) => {
        return typeof value === "number" && value >= 0 && value <= 170;
    };

    return (
        <Chart options={options} series={series} type="line" height={300}/>
    )
}