import React, { useEffect, useState } from "react";

const AnalyseModeles = () => {
  const [data, setData] = useState(null);

  // ✅ Définir dynamiquement l’URL de l’API selon l’environnement
  const API_URL = process.env.REACT_APP_API_URL;
  console.log(" ✅ api_url : " + process.env.REACT_APP_API_URL)

  useEffect(() => {
    // ✅ Utiliser l’URL dynamique
    fetch(`${API_URL}/model/random-forest`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((apiData) => {
        console.log("✅ Données reçues depuis l'API :", apiData);
        setData(apiData);
      })
      .catch((err) => console.error("❌ Erreur API :", err));
  }, [API_URL]);

  if (!data) return <p className="text-gray-600">Chargement...</p>;

  const results = data.results;

  return (
    <div className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        📊 Analyse des Modèles de Régression
      </h2>

      <p className="mb-6 text-gray-600 text-sm sm:text-base">
        <strong>Modèles utilisés :</strong> {data.model}
      </p>

      {/* Conteneur scrollable */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-xs sm:text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2 sm:p-3 text-left">Modèle</th>
              <th className="border p-2 sm:p-3 text-left">Hyperparamètres</th>
              <th className="border p-2 sm:p-3 text-center">R²</th>
              <th className="border p-2 sm:p-3 text-center">RMSE</th>
              <th className="border p-2 sm:p-3 text-center">MAE</th>
            </tr>
          </thead>
          <tbody>
            {/* Random Forest */}
            <tr className="hover:bg-gray-50">
              <td className="border p-2 sm:p-3 font-semibold text-blue-700 whitespace-nowrap">
                🌲 Random Forest
              </td>
              <td className="border p-2 sm:p-3">
                <pre className="text-xs sm:text-sm bg-gray-100 p-2 rounded-md overflow-x-auto max-w-[250px] sm:max-w-xs md:max-w-md">
                  {JSON.stringify(results.random_forest.best_params, null, 2)}
                </pre>
              </td>
              <td className="border p-2 sm:p-3 text-center">
                {results.random_forest.R2.toFixed(3)}
              </td>
              <td className="border p-2 sm:p-3 text-center">
                {results.random_forest.RMSE.toFixed(2)}
              </td>
              <td className="border p-2 sm:p-3 text-center">
                {results.random_forest.MAE.toFixed(2)}
              </td>
            </tr>

            {/* Gradient Boosting */}
            <tr className="hover:bg-gray-50">
              <td className="border p-2 sm:p-3 font-semibold text-green-700 whitespace-nowrap">
                🚀 Gradient Boosting
              </td>
              <td className="border p-2 sm:p-3">
                <pre className="text-xs sm:text-sm bg-gray-100 p-2 rounded-md overflow-x-auto max-w-[250px] sm:max-w-xs md:max-w-md">
                  {JSON.stringify(results.gradient_boosting.best_params, null, 2)}
                </pre>
              </td>
              <td className="border p-2 sm:p-3 text-center">
                {results.gradient_boosting.R2.toFixed(3)}
              </td>
              <td className="border p-2 sm:p-3 text-center">
                {results.gradient_boosting.RMSE.toFixed(2)}
              </td>
              <td className="border p-2 sm:p-3 text-center">
                {results.gradient_boosting.MAE.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyseModeles;
