import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const apiUrl = process.env.REACT_APP_API_URL;

        // Charger stats descriptives
        const statsRes = await axios.get('${apiUrl}/stats/descriptive');
        setStats(statsRes.data);

        // Charger les graphes générés dynamiquement
        const plotsRes = await axios.get('${apiUrl}/stats/plots');
        setPlots(plotsRes.data.files);

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
      }
    };

    fetchData();
  }, []);

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
            {plots.map((file, index) => (
              <div key={index} className="flex flex-col items-center bg-gray-50 p-6 rounded">
                <h3 className="mb-2 font-medium text-gray-600">
                  {file.includes("age_hist") && "Histogramme âge"}
                  {file.includes("hours_boxplot") && "Boxplot heures/semaine"}
                  {file.includes("age_salary") && "Scatter âge vs salaire"}
                  {file.includes("corr_heatmap") && "Heatmap corrélations"}
                </h3>
                <img
                  src={`${apiUrl}${file}`}
                  alt={file}
                  className="rounded shadow-md"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
