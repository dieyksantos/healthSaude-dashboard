FROM python:3.12-slim

WORKDIR /app

# Dependências do sistema (psycopg2-binary normalmente ok sem isso, mas é seguro)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Instala dependências Python
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --no-cache-dir -r /app/requirements.txt

# Copia o backend inteiro (inclui app/)
COPY . /app

ENV PYTHONUNBUFFERED=1

# Railway expõe $PORT. Se não existir, usa 8080.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]