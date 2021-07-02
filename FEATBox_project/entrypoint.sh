apt-get update
apt-get install sshpass
cd feat_web_project
echo { \""database"\": \""db_featweb"\", \""host"\": \""${HOST_IP}"\", \""port"\": \""3306"\", \""username"\": \"" root "\",\""password"\": \""1234"\"} > feat_web_app/config_database.json
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --noinput
python manage.py runserver 0.0.0.0:8000
