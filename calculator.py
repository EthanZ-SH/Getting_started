from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


app = FastAPI(title="Calculator API", version="1.0.0")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"


class CalcRequest(BaseModel):
	a: float
	b: float
	operation: Literal["add", "subtract", "multiply", "divide"]


@app.post("/api/calc")
def calculate(payload: CalcRequest):
	if payload.operation == "add":
		result = payload.a + payload.b
	elif payload.operation == "subtract":
		result = payload.a - payload.b
	elif payload.operation == "multiply":
		result = payload.a * payload.b
	elif payload.operation == "divide":
		if payload.b == 0:
			raise HTTPException(status_code=400, detail="Division by zero is not allowed")
		result = payload.a / payload.b
	else:
		raise HTTPException(status_code=400, detail="Unsupported operation")

	return {
		"a": payload.a,
		"b": payload.b,
		"operation": payload.operation,
		"result": result,
	}


if STATIC_DIR.exists():
	app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def serve_home():
	index_file = STATIC_DIR / "index.html"
	if not index_file.exists():
		raise HTTPException(status_code=404, detail="Static UI not found")
	return FileResponse(index_file)


if __name__ == "__main__":
	import uvicorn

	uvicorn.run("calculator:app", host="127.0.0.1", port=8000, reload=True)