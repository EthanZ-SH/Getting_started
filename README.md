# Getting Started Calculator

A simple calculator web app powered by FastAPI.

## Project Structure

- `calculator.py`: FastAPI app and calculator API endpoint.
- `static/index.html`: Calculator UI markup.
- `static/styles.css`: Calculator styling.
- `static/app.js`: Client-side calculator logic.

## Requirements

- Python 3.10+
- pip

## Install Dependencies

```bash
pip install fastapi uvicorn
```

## Run the App

```bash
python calculator.py
```

Then open:

- http://127.0.0.1:8000/

## API Endpoint

`POST /api/calc`

Request body:

```json
{
  "a": 10,
  "b": 5,
  "operation": "add"
}
```

Supported operations:

- `add`
- `subtract`
- `multiply`
- `divide`

Example response:

```json
{
  "a": 10,
  "b": 5,
  "operation": "add",
  "result": 15
}
```
