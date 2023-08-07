# Java
FROM openjdk:8

# Creates a non-root user
RUN adduser --disabled-password datamixin
RUN adduser datamixin sudo
USER datamixin

# Log
WORKDIR /var/data/logs

# Modeldb
WORKDIR /var/data/modeldb

# Runner
WORKDIR /usr/bin
COPY target/mixin-padang-quarkus-1.0.0-runner.jar /usr/bin

ENV quarkus.datasource.repository.jdbc.url=jdbc:derby:/var/data/modeldb/repository;create=true
ENV quarkus.datasource.preference.jdbc.url=jdbc:derby:/var/data/modeldb/preference;create=true
ENV quarkus.log.file.path=/var/data/logs/workspace.log
ENV quarkus.grpc.server.host=datapilot

# Datapilot
CMD ["java","-Ddataminer=dataminer:8980","-Dfilter.user.id=admin","-Dderby.system.home=/var/data/modeldb","-Dderby.stream.error.file=/var/data/logs/derby.log","-Duploads.path=/var/data/uploads","-Dworkspace.timeout.url=/workspace/timeout","-jar", "mixin-padang-quarkus-1.0.0-runner.jar"]