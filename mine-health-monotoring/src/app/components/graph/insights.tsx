'use client'
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface InsightData {
    name:string,
    data:number[]
}

export const Insights = ({statedata,axisData}:{statedata:InsightData[],axisData:string[]}) => {
    const state:{series: Array<{ name: string; data: number[] }>;options: ApexOptions} = {
        series: statedata,
        options: {
          chart: { height: 350, type: 'area',toolbar:{show:false} },
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth' },
          xaxis: {
            type: 'datetime',
            categories:axisData
          },
          tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
        },
    }


    return (
      <Chart options={state.options} series={state.series} type="area" height={400}/>
    )
}