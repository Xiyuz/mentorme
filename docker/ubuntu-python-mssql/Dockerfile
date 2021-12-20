FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y software-properties-common &&\
    add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update && \
    apt-get upgrade -y &&\
    apt-get install -y curl &&\
    apt-get install -y python3.6 python3.6-dev python3-pip &&\
    rm /usr/bin/python3 &&\
    ln -s python3.6 /usr/bin/python3 &&\
    apt-get install -y apt-utils apt-transport-https
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - &&\
    curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-release.list &&\
    apt-get update &&\
#    apt-get install -y libcurl3 &&\
    ACCEPT_EULA=Y apt-get install -y msodbcsql mssql-tools &&\
    apt-get install -y unixodbc-utf16  odbcinst1debian2-utf16  &&\
    apt-get install -y unixodbc-dev-utf16

ENTRYPOINT ["sh"]