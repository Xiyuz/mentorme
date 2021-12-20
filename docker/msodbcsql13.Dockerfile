FROM mentormeacr.azurecr.io/python3.9-base

RUN apt-get update &&\
    apt-get install -y curl gnupg ca-certificates --no-install-recommends &&\
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - &&\
    echo deb [arch=amd64] http://packages.microsoft.com/ubuntu/16.04/prod xenial main > /etc/apt/sources.list.d/mssql-release.list &&\
    apt-get update &&\
    # unixodbc unixodbc-dev must be installed here or before msodbcsql because M$ also provides unixodbc
    ACCEPT_EULA=Y apt-get -y install unixodbc unixodbc-dev msodbcsql &&\
    apt-get autoremove -y &&\
    rm /etc/apt/sources.list.d/mssql-release.list &&\
    rm -rf /var/lib/apt/lists/*
