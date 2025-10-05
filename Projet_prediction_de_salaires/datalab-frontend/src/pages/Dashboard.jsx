import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL de l'API définie dans Netlify ou en local
  const API_URL = import.meta.env.VITE_API_URL;
  console.log(" ✅ api_url : " + import.meta.env.VITE_API_URL)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger stats descriptives
        const statsRes = await axios.get(`${API_URL}/stats/descriptive`);
        setStats(statsRes.data);

        // Charger les graphes générés dynamiquement
        const plotsRes = await axios.get(`${API_URL}/stats/plots`);
        setPlots(plotsRes.data.files);

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl text-gray-500">
        Chargement des statistiques et des graphiques...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Dashboard DataLab
        </h1>

        {/* Statistiques descriptives */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Statistiques descriptives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="bg-blue-50 p-5 rounded shadow-sm">
                <h3 className="font-medium text-gray-600">{key}</h3>
                <p className="text-xl font-bold text-blue-700">
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Graphiques dynamiques */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Graphiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plots.map((file, index) => {
              let title = '';
              if (file.includes("age_hist")) title = "Histogramme âge";
              if (file.includes("hours_boxplot")) title = "Boxplot heures/semaine";
              if (file.includes("age_salary")) title = "Scatter âge vs salaire";
              if (file.includes("corr_heatmap")) title = "Heatmap corrélations";

              return (
                <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded">
                  <h3 className="mb-2 font-medium text-gray-600">{title}</h3>
                  <img
                    src={`${API_URL}${file}`}
                    alt={file}
                    className="rounded shadow-md"
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
