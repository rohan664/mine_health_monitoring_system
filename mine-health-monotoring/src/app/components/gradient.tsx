import React, { useState, useEffect } from "react";

const GradientSlider = ({ min = 15, max = 40, initialValue = 25,}) => {
  const [sensorValue, setSensorValue] = useState(initialValue);

  // Calculate the marker position as a percentage
  const getMarkerPosition = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="flex flex-col items-center w-full mt-6">
      <div className="relative w-11/12 h-2 bg-gradient-to-r from-blue-400 via-green-400 to-red-400 rounded-full">
        <div
          className="absolute -top-2 transform -translate-y-1/2 w-1 h-1 bg-red-600 rounded-full shadow-md"
          style={{ left: `${getMarkerPosition(sensorValue)}%`, transform: "translate(-50%, -50%)" }}
        ></div>
      </div>
      <div className="flex justify-between w-11/12 mt-2 text-white">
        {[min, 18.5, 25, 30, max].map((label, index) => (
          <span key={index} className="text-[10px]">{label}</span>
        ))}
      </div>
    </div>
  );
};

export default GradientSlider;
