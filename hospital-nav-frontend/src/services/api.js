// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

export const fetchBlueprints = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blueprints/`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching blueprints:", error);
    return [];
  }
};
