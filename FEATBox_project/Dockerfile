FROM nikolaik/python-nodejs:python3.8-nodejs14
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY . /app

RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

RUN npm install --silent && \
    npm install react-scripts@3.4.1 -g --silent && \
    npm run dev

RUN apt-get update \
    apt-get install sshpass

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT /app/entrypoint.sh
