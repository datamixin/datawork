# Python currently 2.4GB using -slim 1.4GB
FROM python:3.9

# Keeps Python from generating .pyc
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for logging
ENV PYTHONUNBUFFERED=1

# Install & use pipenv
WORKDIR /usr/src/python
COPY src/main/python/Pipfile src/main/python/Pipfile.lock ./
RUN python -m pip install --upgrade pip
RUN pip install pipenv && pipenv install --system --deploy

# Creates a non-root user
RUN adduser --disabled-password datamixin
RUN adduser datamixin sudo
USER datamixin

# Grpc python codes
WORKDIR /usr/src/python-gen
COPY src/main/python-gen/value*.py .
COPY src/main/python-gen/evaluate*.py .
COPY src/main/python-gen/dataminer*.py .
COPY src/main/python-gen/filestore*.py .

# Dataminer
WORKDIR /usr/src/python/garut
COPY src/main/python/garut .
ENV PYTHONPATH=/usr/src/python-gen:/usr/src/python

# Storage
WORKDIR /var/data/storage

# Command
WORKDIR /usr/src/python
CMD ["python", "garut/dataminer.py", "--storage", "/var/data/storage","--filestore","datapilot:8981"]