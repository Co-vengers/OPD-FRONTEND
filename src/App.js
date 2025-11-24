import React, { useState } from 'react';
import axios from 'axios';
import ResultCard from './components/ResultCard';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      // Point to backend API
      const response = await axios.post('http://localhost:8000/api/submit-claim', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Failed to process claim. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">OPD Claim Adjudicator</h1>
        <p className="text-slate-500">AI-Powered Insurance Processing</p>
      </header>

      <main className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:bg-slate-50 transition-colors">
            <input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={handleFileChange} 
              className="hidden" 
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded shadow-sm"/>
              ) : (
                <div className="text-slate-500">
                  <p className="text-lg font-medium">Drop medical bill/prescription here</p>
                  <p className="text-sm mt-2">or click to browse</p>
                </div>
              )}
            </label>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!file || loading}
            className={`mt-6 px-8 py-3 rounded-lg font-semibold text-white transition-all
              ${!file || loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}
            `}
          >
            {loading ? 'Analyzing with AI...' : 'Adjudicate Claim'}
          </button>
        </div>

        <ResultCard result={result} />
      </main>
    </div>
  );
}

export default App;