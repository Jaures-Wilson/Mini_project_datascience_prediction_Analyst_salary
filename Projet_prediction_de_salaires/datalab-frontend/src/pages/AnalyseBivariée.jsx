import React, { useEffect, useState } from "react";

const AnalyseBivariee = () => {
  const [anova, setAnova] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ URL de base récupérée depuis la variable d’environnement Netlify
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/stats/anova`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/stats/correlation`).then((res) => res.json()),
    ])
      .then(([anovaData, corrData]) => {
        setAnova(anovaData);
        setCorrelation(corrData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des données :", err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        ⏳ Chargement de l’analyse bivariée...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-600">
          Analyse Bivariée (Salaire Continu)
        </h1>

        {/* SCATTERPLOT */}
        <section className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
            Âge vs Salaire (Scatterplot)
          </h2>
          <div className="flex justify-center">
            <img
              src={`${API_BASE_URL}/static/age_salary.png`}
              alt="Scatterplot âge vs salaire"
              className="rounded shadow-md w-full max-w-lg"
            />
          </div>
        </section>

        {/* HEATMAP */}
        <section className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
            Heatmap des Corrélations
          </h2>
          <div className="flex justify-center">
            <img
              src={`${API_BASE_URL}/static/corr_heatmap.png`}
              alt="Heatmap corrélations"
              className="rounded shadow-md w-full max-w-lg"
            />
          </div>
        </section>

        {/* HISTOGRAMME */}
        <section className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
            Histogramme de l’Âge
          </h2>
          <div className="flex justify-center">
            <img
              src={`${API_BASE_URL}/static/age_hist.png`}
              alt="Histogramme âge"
              className="rounded shadow-md w-full max-w-lg"
            />
          </div>
        </section>

        {/* BOXPLOT */}
        <section className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
            Boxplot des Heures / Semaine par Sexe
          </h2>
          <div className="flex justify-center">
            <img
              src={`${API_BASE_URL}/static/hours_boxplot.png`}
              alt="Boxplot heures"
              className="rounded shadow-md w-full max-w-lg"
            />
          </div>
        </section>

        {/* ANOVA */}
        <section className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
            ANOVA : Salaire par Diplôme
          </h2>
          {anova ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-center border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">F-statistic</th>
                    <th className="border px-4 py-2">p-value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-mono text-blue-600">
                      {anova["F-statistic"].toFixed(3)}
                    </td>
                    <td
                      className={`border px-4 py-2 font-mono ${
                        anova["p-value"] < 0.05
                          ? "text-green-600 font-bold"
                          : "text-red-600"
                      }`}
                    >
                      {anova["p-value"].toExponential(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée ANOVA disponible</p>
          )}
        </section>

        {/* MATRICE DE CORRÉLATION */}
        <section className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
            Matrice de Corrélation
          </h2>
          {correlation ? (
            <div className="overflow-x-auto">
              <table className="table-auto min-w-max text-center border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th></th>
                    {Object.keys(correlation).map((col) => (
                      <th key={col} className="border px-4 py-2">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(correlation).map((row) => (
                    <tr key={row}>
                      <td className="border px-4 py-2 font-semibold bg-gray-100">
                        {row}
                      </td>
                      {Object.keys(correlation[row]).map((col) => {
                        const value = correlation[row][col];
                        return (
                          <td
                            key={col}
                            className={`border px-4 py-2 font-mono ${
                              value > 0.5
                                ? "text-green-600 font-bold"
                                : value < -0.5
                                ? "text-red-600 font-bold"
                                : "text-gray-700"
                            }`}
                          >
                            {value.toFixed(3)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucune corrélation disponible</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AnalyseBivariee;
