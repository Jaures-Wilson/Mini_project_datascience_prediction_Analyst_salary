#model_utils.py
import numpy as np
import pandas as pd
import joblib
import os
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

# Chemins pour sauvegarder les modèles
LINEAR_MODEL_PATH = "linear_model.pkl"
RF_MODEL_PATH = "random_forest.pkl"
GB_MODEL_PATH = "gradient_boosting.pkl"


def train_and_save_models(force_train=False):
    """
    Entraîne le modèle de régression linéaire et retourne le dataset de test.
    Si le modèle existe et force_train=False, il est chargé depuis disque.
    """
    df = pd.read_csv('../data/adult_clean.csv')

    X = df[["age", "hours.per.week"]]
    y = df["salary"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    if not force_train and os.path.exists(LINEAR_MODEL_PATH):
        print("✅ Modèle linéaire trouvé sur disque, chargement...")
        linear_model = joblib.load(LINEAR_MODEL_PATH)
    else:
        print("⚠️ Modèle linéaire absent ou force_train=True → entraînement...")
        linear_model = LinearRegression()
        linear_model.fit(X_train, y_train)
        joblib.dump(linear_model, LINEAR_MODEL_PATH)

        # Graphe régression linéaire
        y_pred = linear_model.predict(X_test)
        order = np.argsort(X_test["age"])
        plt.figure(figsize=(6, 4))
        plt.scatter(X_test["age"], y_test, label="Données réelles", color="blue")
        plt.plot(X_test["age"].iloc[order], y_pred[order], label="Prédiction", color="red")
        plt.xlabel("Âge")
        plt.ylabel("Salaire")
        plt.title("Régression Linéaire")
        plt.legend()
        plt.tight_layout()
        os.makedirs("static", exist_ok=True)
        plt.savefig("static/regression_plot.png")
        plt.close()

        print("✅ Modèle linéaire entraîné et sauvegardé.")

    return linear_model, X_test, y_test


def train_and_save_advanced_models(force_train=False):
    df = pd.read_csv('../data/adult_clean.csv')
    X = df[["age", "hours.per.week"]]
    y = df["salary"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    if not force_train and os.path.exists(RF_MODEL_PATH) and os.path.exists(GB_MODEL_PATH):
        print("✅ Modèles RF & GB trouvés sur disque, chargement...")
        rf_model = joblib.load(RF_MODEL_PATH)
        gb_model = joblib.load(GB_MODEL_PATH)
    else:
        print("⚠️ Entraînement des modèles avancés (RF & GB)...")
        rf = RandomForestRegressor(random_state=42)
        grid_rf = GridSearchCV(rf, {"n_estimators": [50, 100, 200], "max_depth": [2, 3, 5, None]}, cv=3, scoring="r2")
        grid_rf.fit(X_train, y_train)
        rf_model = grid_rf.best_estimator_
        joblib.dump(rf_model, RF_MODEL_PATH)

        gb = GradientBoostingRegressor(random_state=42)
        grid_gb = GridSearchCV(gb, {"n_estimators": [50, 100, 200], "learning_rate": [0.01, 0.05, 0.1], "max_depth": [2, 3, 5]}, cv=3, scoring="r2")
        grid_gb.fit(X_train, y_train)
        gb_model = grid_gb.best_estimator_
        joblib.dump(gb_model, GB_MODEL_PATH)

        print("✅ Modèles RF & GB entraînés et sauvegardés.")

    # Évaluation sur test
    rf_pred = rf_model.predict(X_test)
    gb_pred = gb_model.predict(X_test)

    results = {
        "random_forest": {
            "best_params": rf_model.get_params(),
            "R2": r2_score(y_test, rf_pred),
            "RMSE": np.sqrt(mean_squared_error(y_test, rf_pred)),
            "MAE": mean_absolute_error(y_test, rf_pred)
        },
        "gradient_boosting": {
            "best_params": gb_model.get_params(),
            "R2": r2_score(y_test, gb_pred),
            "RMSE": np.sqrt(mean_squared_error(y_test, gb_pred)),
            "MAE": mean_absolute_error(y_test, gb_pred)
        }
    }

    return rf_model, gb_model, results



def load_models(force_train=False):
    """Charge le modèle linéaire (ou l'entraîne si absent)."""
    return train_and_save_models(force_train=force_train)


def load_advanced_models(force_train=False):
    """Charge RF et GB (ou les entraîne si absents)."""
    return train_and_save_advanced_models(force_train=force_train)
