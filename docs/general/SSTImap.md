```python
.\venv\Scripts\activate.bat
python sstimap.py -u <url>
Example: python sstimap.py -u https://0a17008e037b3b5482f8ba4d003a005d.web-security-academy.net/?message=Unfortunately%20this%20product%20is%20out%20of%20stock -d csrf=123 -d name=john -m POST
```

Use option `--os-shell` to get an os shell.

Currently testing: https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-basic-code-context (Doesn't seem to work)