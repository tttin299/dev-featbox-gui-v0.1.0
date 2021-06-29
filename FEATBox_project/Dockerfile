FROM nikolaik/python-nodejs:python3.8-nodejs14
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . /app
RUN npm install

CMD npm run dev
CMD python feat_web_project/manage.py runserver 0.0.0.0:8000