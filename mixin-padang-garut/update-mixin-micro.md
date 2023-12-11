<!--
Copyright (c) 2020-2023 Datamixin.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.-->
C:
cd C:\Development\Andia\mixin-prediction
call git pull
cd C:\Development\Andia\mixin-prediction\mixin
call mvn clean

cd C:\Development\Andia\mixin-prediction\mixin-webface\src\main\js
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

cd C:\Development\Andia\mixin-prediction\mixin-sleman-webface\src\main\js 
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

cd C:\Development\Andia\mixin-prediction\mixin-bekasi-webface\src\main\js 
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

cd C:\Development\Andia\mixin-prediction\mixin-lawang-webface\src\main\js
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

cd C:\Development\Andia\mixin-prediction\mixin-padang-webface\src\main\js
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

cd C:\Development\Andia\mixin-prediction\mixin-padang-vegazoo\src\main\js
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

cd C:\Development\Andia\mixin-prediction\mixin-padang-rinjani\src\main\js
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

cd C:\Development\Andia\mixin-prediction\mixin-padang-malang\src\main\js
call npm run npm-run-prod
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

::cd C:\Development\Andia\mixin-prediction\mixin-padang-tampomas\src\main\js
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

::cd C:\Development\Andia\mixin-prediction\mixin-padang-ludwig\src\main\js
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install

::cd C:\Development\Andia\mixin-prediction\mixin-padang-fastai\src\main\js
::call npm run npm-run-prod-source
::call npm run npm-run-dev
::call npm install


C:
cd C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python

call pipenv uninstall --all
call pipenv install
call pipenv install --dev
call pipenv run python -m grpc_tools.protoc --proto_path=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto --grpc_python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen --python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto\datastore.proto
call pipenv run python -m grpc_tools.protoc --proto_path=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto --grpc_python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen --python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto\filestore.proto

::call pip freeze > C:\Datastore\uninstall.txt
::call pip uninstall -r C:\Datastore\uninstall.txt -y

::call pip install -r src\main\python\requirements.txt
::call pip install pyinstaller

::cd C:\Development\Andia\mixin-prediction\mixin-padang-garut
::call python -m grpc_tools.protoc --proto_path=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto --grpc_python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen --python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto\datastore.proto

cd C:\Development\Andia\mixin-prediction\mixin-padang-garut
call mvn generate-sources

cd C:\Development\Andia\mixin-prediction\mixin
call mvn install -DskipTests

cd C:\Development\Andia\mixin-prediction\mixin-padang-quarkus
call mvn clean install -DskipTests
cd C:\Development\Andia\mixin-prediction\mixin-padang-quarkus
java -jar target/mixin-padang-quarkus-1.0.0-runner.jar

PAUSE
