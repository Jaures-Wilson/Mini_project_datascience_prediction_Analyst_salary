import requests

url = "http://127.0.0.1:5000/evaluate"
payload = {
    "X_test": [
        {"age": 35, "hours.per.week": 40},
        {"age": 50, "hours.per.week": 60}
    ],
    "y_test": [1, 0]
}

response = requests.post(url, json=payload)

print("STATUS CODE:", response.status_code)
print("RAW TEXT:", response.text)  # Ajoute ceci pour voir la vraie réponse

try:
    data = response.json()
    print("✅ JSON PARSED:", data)
except Exception as e:
    print("❌ Erreur JSON :", e)
