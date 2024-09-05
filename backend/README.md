# Backend

- This backend sets up a FastApi service and then listens for API requests in main.py before making requests to Google Gemini for AI generated content.
- Everything now is in "main.py"

## Prerequisites

- You have to go and get API_KEY from gemini api.

## Running locally

- Run this command to run the backend FastApi application locally:
  `uvicorn main:app --reload --host 127.0.0.0 --port 3000`

## Code to run

- Updating Requirements

When you update requirements.txt, you need to install the new requirements in your virtual environment:

```
source /path/to/your/venv/bin/activate
pip install -r /path/to/your/app/requirements.txt
```

- Run code

```
source /path/to/your/venv/bin/activate
pip install -r /path/to/your/app/requirements.txt
python3 main.py
```

## Working with systemd for running python app

- Setup systemd to create virtual environment and then run main.py

1. Reload the systemd Service

After updating the Python file or requirements, reload the systemd service:

```
sudo systemctl daemon-reload
sudo systemctl restart fastapi.service
```

2. Check status of the serivec

```
sudo systemctl status fastapi.service
```

3. To view real-time logs for your service, use the following command:

```
sudo journalctl -u fastapi.service -f
```

To view the last 100 lines of logs, use:

```
sudo journalctl -u fastapi.service -n 100
```

### Steps to start the service in the first place

```
code /etc/systemd/system/fastapi.service
sudo systemctl daemon-reload
sudo systemctl enable fastapi.service
sudo systemctl start fastapi.service
```

## See values in sqlite database

- `sqlite3 test.db`
- `SELECT * FROM users;`
