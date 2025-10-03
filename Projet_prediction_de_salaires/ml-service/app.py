# app.py
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
import os
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from scipy.stats import f_oneway
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import joblib
from model_utils import load_models, train_and_save_advanced_models, load_advanced_models

app = Flask(__name__)
CORS(app)

# === Charger le dataset ===
df = pd.read_csv('../data/adult_clean.csv')
print("Colonnes du dataset :", df.columns)

# === Charger ou entraîner les modèles ===
linear_model, X_test, y_test = load_models()
rf_model, gb_model, _ = load_advanced_models()


# === ROUTES ===
@app.route('/')
def home():
    return "<h1>API de Modélisation Régression Continue</h1>"

# === Statistiques descriptives ===
@app.route('/stats/descriptive', methods=['GET'])
def descriptive_stats():
    stats = {
        'age_mean': df['age'].mean(),
        'age_median': df['age'].median(),
        'age_std': df['age'].std(),
        'hours_mean': df['hours.per.week'].mean(),
        'hours_median': df['hours.per.week'].median(),
        'hours_std': df['hours.per.week'].std(),
        'salary_mean': df['salary'].mean(),
        'salary_median': df['salary'].median(),
        'salary_std': df['salary'].std()
    }
    return jsonify(stats)

# === Détection des outliers ===
@app.route('/stats/outliers', methods=['GET'])
def detect_outliers():
    Q1 = df['age'].quantile(0.25)
    Q3 = df['age'].quantile(0.75)
    IQR = Q3 - Q1
    outliers_age = df[(df['age'] < (Q1 - 1.5 * IQR)) | (df['age'] > (Q3 + 1.5 * IQR))]
    return jsonify({
        'num_outliers_age': outliers_age.shape[0],
        'outliers_age_indices': outliers_age.index.tolist()
    })

# === Graphiques statistiques ===
@app.route('/stats/plots', methods=['GET'])
def stats_plots():
    os.makedirs("static", exist_ok=True)

    # Histogramme âge
    plt.figure(figsize=(6,4))
    df['age'].hist()
    plt.title("Histogramme de l'âge")
    plt.xlabel("Âge")
    plt.ylabel("Nombre")
    plt.savefig("static/age_hist.png")
    plt.close()

    # Boxplot heures/semaine par sexe
    plt.figure(figsize=(6,4))
    df.boxplot(column='hours.per.week', by='sex')
    plt.title("Boxplot heures/semaine par sexe")
    plt.suptitle("")
    plt.savefig("static/hours_boxplot.png")
    plt.close()

    # Scatterplot âge vs salaire
    plt.figure(figsize=(6,4))
    sns.scatterplot(data=df, x='age', y='salary')
    plt.xlabel('Âge')
    plt.ylabel('Salaire')
    plt.title('Âge vs Salaire')
    plt.savefig("static/age_salary.png")
    plt.close()

    # Heatmap corrélations
    corr_matrix = df[['age', 'hours.per.week', 'salary']].corr()
    plt.figure(figsize=(6,5))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')
    plt.savefig("static/corr_heatmap.png")
    plt.close()

    return jsonify({"message": "Graphiques générés", "files": [
        "/static/age_hist.png",
        "/static/hours_boxplot.png",
        "/static/age_salary.png",
        "/static/corr_heatmap.png"
    ]})

# === ANOVA ===
@app.route('/stats/anova', methods=['GET'])
def anova():
    grouped = [group['salary'].values for name, group in df.groupby('education')]
    f_stat, p_val = f_oneway(*grouped)
    return jsonify({"F-statistic": f_stat, "p-value": p_val})

# === Corrélation ===
@app.route('/stats/correlation', methods=['GET'])
def correlation_matrix():
    corr = df[['age', 'hours.per.week', 'salary']].corr()
    return jsonify(corr.to_dict())

# === Régression Linéaire ===
@app.route('/model/regression-linear', methods=['GET'])
def regression_linear():
    try:
        age = float(request.args.get("age"))
        hours = float(request.args.get("hours"))
    except (TypeError, ValueError):
        return jsonify({"error": "Veuillez fournir age et hours en paramètres."}), 400

    X_new = np.array([[age, hours]])
    prediction = linear_model.predict(X_new)[0]
    return jsonify({
        "prediction": float(prediction),
        "coefficients": linear_model.coef_.tolist(),
        "intercept": float(linear_model.intercept_),
        "graph_url": "/model/regression-linear/plot"
    })

# === Graphe Régression Linéaire ===
@app.route('/model/regression-linear/plot', methods=['GET'])
def regression_linear_plot():
    y_pred = linear_model.predict(X_test)
    plt.figure(figsize=(7, 5))
    plt.scatter(X_test['age'], y_test, alpha=0.2, label="Valeurs réelles")
    plt.scatter(X_test['age'], y_pred, color='red', alpha=0.1, label="Valeurs prédites")
    plt.xlabel("Âge")
    plt.ylabel("Salaire estimé")
    plt.title("Régression Linéaire : Salaire vs Âge")
    plt.legend()
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    return Response(buf.getvalue(), mimetype='image/png')

# === Random Forest & Gradient Boosting (Régression) ===
@app.route("/model/random-forest", methods=["GET"])
def train_rf():
    _, _, results = train_and_save_advanced_models()  # on ignore les modèles
    return jsonify({"model": "RandomForest & GradientBoosting", "results": results})


@app.route("/model/compare", methods=["GET"])
def compare_models():
    return jsonify({
        "status": "✅ Modèles chargés",
        "rf_params": rf_model.get_params(),
        "gb_params": gb_model.get_params()
    })

# === Évaluation des modèles ===
@app.route("/evaluate", methods=["POST"])
def evaluate_models():
    data = request.get_json()
    X_test = pd.DataFrame(data["X_test"])
    y_test = pd.Series(data["y_test"])

    rf_pred = rf_model.predict(X_test)
    gb_pred = gb_model.predict(X_test)

    results = {
        "random_forest": {
            "R2": r2_score(y_test, rf_pred),
            "RMSE": np.sqrt(mean_squared_error(y_test, rf_pred)),
            "MAE": mean_absolute_error(y_test, rf_pred)
        },
        "gradient_boosting": {
            "R2": r2_score(y_test, gb_pred),
            "RMSE": np.sqrt(mean_squared_error(y_test, gb_pred)),
            "MAE": mean_absolute_error(y_test, gb_pred)
        },
    }
    return jsonify(results)

# === Prédiction salaire ===
@app.route("/predict", methods=["POST"])
def predict_salary():
    data = request.get_json()
    # Adapter les clés pour matcher le modèle
    data_renamed = {
        "age": data.get("age"),
        "hours.per.week": data.get("hours_per_week")
    }
    X_input = pd.DataFrame([data_renamed])
    rf_pred = rf_model.predict(X_input)[0]
    return jsonify({
        "model": "RandomForest",
        "predicted_salary": round(float(rf_pred), 2)
    })


if __name__ == '__main__':
    app.run(port=5000, debug=True)
