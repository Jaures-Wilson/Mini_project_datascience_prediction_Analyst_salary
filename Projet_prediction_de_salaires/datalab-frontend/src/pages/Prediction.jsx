import React, { useState } from "react";

export default function Prediction() {
  const [formData, setFormData] = useState({
    age: "",
    sexe: "Male",
    education_level: "",
    sector: "",
    hours_per_week: ""
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation basique des champs
  const validate = () => {
    const newErrors = {};

    if (!formData.age) newErrors.age = "L'âge est requis";
    else if (isNaN(formData.age) || Number(formData.age) <= 0)
      newErrors.age = "L'âge doit être un nombre positif";

    if (!["Male", "Female"].includes(formData.sexe))
      newErrors.sexe = "Sexe invalide";

    if (!formData.education_level)
      newErrors.education_level = "Le niveau d'étude est requis";

    if (!formData.sector) newErrors.sector = "Le secteur est requis";

    if (!formData.hours_per_week)
      newErrors.hours_per_week = "Le nombre d'heures est requis";
    else if (isNaN(formData.hours_per_week) || Number(formData.hours_per_week) <= 0)
      newErrors.hours_per_week = "Doit être un nombre positif";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la prédiction.");
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Erreur:", error);
      setResult({ error: "Impossible de prédire le salaire." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🔮 Estimation de Salaire
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-medium capitalize">{key.replace("_", " ")}</label>
            <input
              type={key === "age" || key === "hours_per_week" ? "number" : "text"}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className={`border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors[key] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[key] && (
              <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 w-full hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Prédiction en cours..." : "Prédire"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
          {result.error ? (
            <p className="text-red-600 font-semibold">{result.error}</p>
          ) : (
            <>
              <p className="font-semibold text-lg text-gray-800">
                Salaire estimé :
              </p>
              <p className="text-green-700 text-2xl font-bold">
                {result.predicted_salary.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "XAF" // ou "XAF" selon ton dataset
                })}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
