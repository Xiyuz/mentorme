#!/bin/bash

for d in */ ; do
    cd "$d"
    pip install --target ./package -r requirements.txt;
    cd package;
    zip -r9 ${OLDPWD}/function.zip .;
    cd $OLDPWD;
    zip -g function.zip *.py
    cd ..
done
