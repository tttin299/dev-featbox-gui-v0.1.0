# Clone code from git
git clone https://github.com/tttin299/dev-featbox-gui-v0.1.0.git

# Move to directory
cd dev-featbox-gui-v0.1.0/FEATBox_project

# Compose command build image and run container
docker-compose up -d

# Go to bash of image web
docker-compose exec web bash

# Move to directory
cd feat_web_project

# Backend Django command
python manage.py makemigrations

python manage.py migrate

python createsuperuser

# Frontend command (if you rebuild interface)

npm install 

npm run dev
