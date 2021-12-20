FROM mentormeacr.azurecr.io/msodbcsql13

WORKDIR /usr/src/app

COPY backend/requirements.txt ./

RUN apt-get update &&\
    apt-get install -y libffi-dev openssl libssl-dev build-essential --no-install-recommends &&\
    python3.8 -m pip install --no-cache-dir -r requirements.txt &&\
    apt-get remove -y build-essential libffi-dev libssl-dev curl &&\
    rm -rf /var/lib/apt/lists/*

COPY ./backend/src .
EXPOSE 8000
ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:8000", "mentorme.wsgi"]