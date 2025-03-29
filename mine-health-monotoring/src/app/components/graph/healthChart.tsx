// components/HealthChart.tsx
import { useEffect, useRef } from 'react';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';

type HealthData = {
  timestamp: string;
  spo2: number;
  bpm: number;
};

interface HealthChartProps {
  data: HealthData[];
}

export default function HealthChart({ data }: HealthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<keyof ChartTypeRegistry, string[], string> | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const timestamps = data.map((entry) => new Date(entry.timestamp).toLocaleTimeString());
    const spo2Values = data.map((entry) => entry.spo2);
    const bpmValues = data.map((entry) => entry.bpm);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'SpO2 (%)',
            data: spo2Values,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointRadius: 3,
            pointHoverRadius: 5,
          },
          {
            label: 'BPM',
            data: bpmValues,
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(229, 231, 235, 1)',
            },
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Health Metrics Trend</h3>
      <div className="relative h-80">
        <canvas ref={chartRef} />
      </div>
      <div className="mt-2 text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}