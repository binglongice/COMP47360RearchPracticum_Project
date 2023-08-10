
FROM python:3.9

RUN apt-get update && apt-get install -y nodejs npm

#create directory where you host your project
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . /app

#RUN cd coffee-compass && npm install && npm run build

#WORKDIR /app/yelp_integration

#RUN python manage.py makemigrations
RUN python manage.py migrate

#RUN python manage.py collectstatic --noinput

#RUN cp -r ../coffee-compass/build static/

CMD python manage.py runserver 0.0.0.0:8000

