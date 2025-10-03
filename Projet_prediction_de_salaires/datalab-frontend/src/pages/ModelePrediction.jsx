import React, { useEffect, useState } from "react";
import axios from "axios";

const ModelePrediction = () => {
  const [linear, setLinear] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  // 🔧 Valeurs de test pour la prédiction
  const ageTest = 28;
  const hoursTest = 45;

  useEffect(() => {
    // === Régression Linéaire ===
    axios
      .get(
        `http://127.0.0.1:5000/model/regression-linear?age=${ageTest}&hours=${hoursTest}`
      )
      .then((res) => setLinear(res.data))
      .catch((err) => console.error("Erreur Linéaire:", err));

    // === Évaluation des modèles avancés (RF & GB) ===
    axios
      .get(`http://127.0.0.1:5000/model/compare`)
      .then((res) => setEvaluation(res.data))
      .catch((err) => console.error("Erreur Évaluation:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">
        📊 Prédictions de Salaire (Régression Continue)
      </h1>

      {/* ======= Régression Linéaire ======= */}
      {linear && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            🔹 Régression Linéaire
          </h2>
          <p className="mb-2">
            <strong>Prédiction Salaire :</strong>{" "}
            <span className="text-lg font-bold text-blue-700">
              {linear.prediction} €
            </span>
          </p>
          <p className="mb-1">
            <strong>Coefficients :</strong>{" "}
            {linear.coefficients.map((c, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded mx-1">
                {c.toFixed(3)}
              </span>
            ))}
          </p>
          <p className="mb-4">
            <strong>Intercept :</strong> {linear.intercept.toFixed(2)}
          </p>
          <img
            src={`http://127.0.0.1:5000${linear.graph_url}`}
            alt="Graphique Régression Linéaire"
            className="rounded-lg shadow-md border border-gray-300 w-full max-w-3xl mx-auto"
          />
        </div>
      )}

      {/* ======= Évaluation des modèles RF & GB ======= */}
      {evaluation && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">
            🔸 Modèles Avancés (RandomForest & GradientBoosting)
          </h2>
          <p className="mb-2 text-gray-600">
            <strong>Statut :</strong> {evaluation.status}
          </p>
          <p className="mb-1">
            <strong>Paramètres RandomForest :</strong>{" "}
            <code className="bg-gray-100 p-1 rounded">
              {JSON.stringify(evaluation.rf_params, null, 2)}
            </code>
          </p>
          <p className="mt-2">
            <strong>Paramètres GradientBoosting :</strong>{" "}
            <code className="bg-gray-100 p-1 rounded">
              {JSON.stringify(evaluation.gb_params, null, 2)}
            </code>
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelePrediction;
