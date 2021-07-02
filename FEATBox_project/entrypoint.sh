apt-get update
apt-get install sshpass
echo { \""database"\": \""db_featweb"\", \""host"\": \"" 172.168.1.1 "\", \""port"\": \""3306"\", \""username"\": \"" root "\",\""password"\": \""1234"\"} > feat_web_app/feat_database.json
cd feat_web_project
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --noinput
python manage.py runserver 0.0.0.0:8000
