import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";
const API_URL = "http://localhost:3000/api/clothes";

export default function GenerateOutfitsComponent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [outfits, setOutfits] = useState([""]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      // Call your backend API
      if (!user) {
        setError("Please log in to generate outfits.");
        setLoading(false);
        return;
      }
      const response = await axios.get(
                `${API_URL}/generate-outfits`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        // you can send user inputs here if needed
        // e.g., style: "casual", color: "blue"
      });

      // Assuming API returns an array of outfit objects
      setOutfits(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-outfits-container">
      <h2>Generate Outfits</h2>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Generating..." : "Generate Outfits"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
            <h3 className="mt-4">Generated Outfits:</h3>

{/* {outfits.length > 0 && ( */}
      <div className="outfits-list mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(outfits) && outfits.length > 0 ? (

        outfits.map((outfit, index) => (
          <div key={index} className="outfit-card p-2 shadow rounded">
            <img
                            src={outfit.imageBase64 ? outfit.imageBase64 : outfit.imageUrl} 

              // src={outfit.imageUrl} // make sure your API returns full accessible URL
              alt={outfit.title || `Outfit ${index + 1}`}
              className="w-full h-48 object-cover rounded"
            />
            <h4 className="mt-2 text-center">{outfit.title}</h4>
          </div>
        ))
      ):(
        <p>No outfits generated yet.</p>
      )}
      </div>
      {/* // )} */}

    </div>
    
  );
}
