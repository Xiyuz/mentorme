FROM darieni/ubuntu:xenial
ENV LANG=en_US.UTF-8
RUN apt-get update &&\
    apt-get install -y curl gnupg ca-certificates software-properties-common locales --no-install-recommends &&\
    localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 &&\
    add-apt-repository -y ppa:deadsnakes/ppa &&\
    apt-get update &&\
    apt-get install -y python3.8 python3.8-dev python3.8-venv --no-install-recommends &&\
    apt-get remove -y software-properties-common &&\
    apt-get autoremove -y &&\
    rm -rf /var/lib/apt/lists/* &&\
    python3.8 -m ensurepip --upgrade &&\
    python3.8 -m pip install --no-cache-dir pip --upgrade &&\
    python3.8 -m pip install --no-cache-dir setuptools --upgrade 
