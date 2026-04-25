import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_keep_alive():
    response = client.get("/keep-alive")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"
    assert "timestamp" in data
    print("✅ /keep-alive endpoint returned successfully:", data)

if __name__ == "__main__":
    test_keep_alive()
