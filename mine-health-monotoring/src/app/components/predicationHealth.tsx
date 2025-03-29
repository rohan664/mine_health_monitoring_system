// components/PredictHealth.tsx
import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

type HealthInput = {
  spo2: number;
  bpm: number;
};

export default function PredictHealth() {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [inputData, setInputData] = useState<HealthInput>({ spo2: 95, bpm: 72 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load model on component mount
  useEffect(() => {
    let isMounted = true;

    async function loadModel() {
      try {
        setIsLoading(true);
        const loadedModel = await tf.loadGraphModel('/model/model.json');
        if (isMounted) {
          setModel(loadedModel);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load the health prediction model');
          console.error("Model loading error:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // Predict health status
  const predictHealth = async () => {
    if (!model) {
      setError('Model is not loaded yet');
      return;
    }

    try {
      setIsLoading(true);
      
      // Convert input to tensor
      const inputTensor = tf.tensor2d([[inputData.spo2, inputData.bpm]]);
      
      // Predict
      const outputTensor = model.predict(inputTensor) as tf.Tensor;
      const result = await outputTensor.data();
      
      // Update prediction state
      setPrediction(result[0]);
      setError(null);
      
      // Clean up tensors
      tf.dispose([inputTensor, outputTensor]);
    } catch (err) {
      setError('Prediction failed');
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  return (
    <div className="w-full p-6 mx-auto bg-white rounded-lg shadow-md flex items-center flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Anomaly Detection</h2>
      
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center">
          <label htmlFor="spo2" className="w-24 text-gray-700">SpO2 (%):</label>
          <input
            id="spo2"
            name="spo2"
            type="number"
            min="0"
            max="100"
            value={inputData.spo2}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="bpm" className="w-24 text-gray-700">BPM:</label>
          <input
            id="bpm"
            name="bpm"
            type="number"
            min="30"
            max="200"
            value={inputData.bpm}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <button 
          onClick={predictHealth}
          disabled={isLoading || !model}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading || !model ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Check Health'}
        </button>

        {prediction !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">
              Anomaly Score: <strong>{prediction.toFixed(4)}</strong>
            </p>
            <p className={`mt-2 font-medium ${prediction < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {prediction < 0 ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Anomaly Detected
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Normal
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}