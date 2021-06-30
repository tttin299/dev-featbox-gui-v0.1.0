git clone https://github.com/tttin299/dev-featbox-gui-v0.1.0.git

cd dev-featbox-gui-v0.1.0/FEATBox_project

docker-compose up db

docker-compose up web

docker-compose exec web bash

cd feat_web_project

python manage.py makemigrations

python manage.py migrate

python createsuperuser