apt-get update
apt-get install sshpass
cd feat_web_project
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --noinput
python manage.py runserver 0.0.0.0:8000
