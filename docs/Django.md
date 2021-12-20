#Setup local Django server
##Install microsoft pyodbc driver 13

- We need to install Driver 13. Last version Documentation installs Driver 17.
- **You have to install the Driver 13 again. Please follow the commands below**
```buildoutcfg
sudo su
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
exit
sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install msodbcsql mssql-tools
sudo apt-get install unixodbc-dev-utf16 #this step is optional but recommended*
```
- check the installation by running the command `odbcinst -d -q`, you should see [ODBC 13 ...]

## Set up python environment
- use python 3.6, and pip install the packages requirements.txt
```buildoutcfg
# Django has been upgrade to 3.0, you should rerun the pip install bellow
pip install -r requirements.txt
# make sure NOT use python2
```
- if you do not want to mess up you global python environment, you can create a virtual python env by ‘virtualenv’.

##(Optional) Connect to Azure SQL DB
- no need for local test. the local test uses the django default ‘sqlite’ db, which stores the data on the local machine.
- if need to connect to Azura SQL DB, change the `DATABASE SETTING` in `mentorme/setting.py`
```buildoutcfg
DATABASES = {
    'default': {
        'ENGINE': 'sql_server.pyodbc',
        'NAME': 'mentorme_sqldb',
        'USER': 'mentorme_admin',
        'PASSWORD': 'mentor_me2020',
        'HOST': 'tcp:mentorme-sqlserver.database.windows.net',
        'PORT': '1433',
        'OPTIONS': {
            'DRIVER': 'ODBC Driver 13 for SQL Server',
            'MARS_Connection': 'True',
        }
    },
    'sqlite3': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```
- [reference](https://medium.com/@__pamaron__/deploy-a-django-application-connected-to-azure-sql-using-docker-and-azure-app-service-a2c107773c11)

## Run the server
- In the base dir, run command:
```
python manage.py makemigrations <app name>
python manage.py migrate
python manage.py runserver
```
- You should see the example of Profile API on the url: localhost:8000/profiles/

# Build RESTful API

## Create your module for the API
- [Main Doc](https://www.django-rest-framework.org/)
- use django to start a new app, for example, the ‘profile’
- add models (db tables) in ‘profile/model.py’, then migrate your changes
- For more details, please check the example module ‘profile’.

## Authentication of the RESTful API
- We apply the ‘django.contrib.auth’ to help with the authentication. Each profile has a foreign key of its owner ‘auth.User’. Only the owner can modify the profiles.
- Implementation details: [reference](https://www.django-rest-framework.org/tutorial/4-authentication-and-permissions/ )
