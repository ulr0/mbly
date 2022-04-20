FROM python:3.9

WORKDIR /usr/src/app/back

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "ably.wsgi:application"]