# Clone code from git
git clone https://github.com/tttin299/dev-featbox-gui-v0.1.0.git

# Move to directory
cd dev-featbox-gui-v0.1.0/FEATBox_project

# Compose command build image mysql:5.7.22
docker-compose up db

# Compose command build image web
docker-compose up web

# Go to bash of image web
docker-compose exec web bash

# Move to directory
cd feat_web_project

# Django command
python manage.py makemigrations

python manage.py migrate

python createsuperuser