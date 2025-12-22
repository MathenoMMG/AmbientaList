from fastapi import FastAPI

app = FastAPI(title="AmbientaList API")

@app.get("/")
def read_root():
    return {"message": "Welcome to AmbientaList API"}
