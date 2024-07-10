#  Dockerfile is designed to set up a production environment for your Flask application with a PostgreSQL database. 

## FROM python:3.9.18-alpine3.18
### Uses a lightweight Alpine-based Python image, ensuring a minimal and secure base for your application.

##  RUN apk add build-base 
### Installs essential build tools required for compiling any necessary packages.

## RUN apk add postgresql-dev gcc python3-dev musl-dev
### Installs PostgreSQL development libraries and other necessary development tools. These are required to compile and install Python packages that depend on PostgreSQL, such as psycopg2

## ARG FLASK_APP
## ARG FLASK_ENV
## ARG DATABASE_URL
## ARG SCHEMA
## ARG SECRET_KEY
### These arguments allow you to pass environment-specific variables at build time. They can be used to configure the Flask application during the build process.

## WORKDIR /var/www
### Sets the working directory in the container where the application files will be located.

## COPY requirements.txt .
## RUN pip install -r requirements.txt
### Copies the requirements.txt file to the container and installs the listed Python dependencies.

## RUN pip install psycopg2
### Installs the psycopg2 package separately due to its dependency on system libraries.

## COPY . .
### Copies all the application code from the host machine to the working directory in the container.

## RUN flask db upgrade
## RUN flask seed all

## CMD gunicorn app:app
### Uses gunicorn to serve the Flask application in a production environment. This command starts the Flask application, with app:app indicating that the Flask application instance is named app in the app.py file.