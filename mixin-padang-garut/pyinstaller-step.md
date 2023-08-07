<!--
Copyright (c) 2020-2023 Datamixin.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
-->
cd C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python

call pipenv uninstall --all
call pipenv install
call pipenv install --dev
call pipenv run python -m grpc_tools.protoc --proto_path=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto --grpc_python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen --python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto\datastore.proto
call pipenv run python -m grpc_tools.protoc --proto_path=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto --grpc_python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen --python_out=C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto\filestore.proto

cd C:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python
call pipenv run pyinstaller -p ./;../python-gen;../../../../mixin-base/src/main/python --collect-all "xgboost" --distpath "C:\Datastore\output" --specpath "C:\Datastore\output" --hidden-import "distutils.core" --workpath "C:/Development/Andia/mixin-prediction/mixin-padang-garut\src\main\python-gen" --onefile garut\datastore.py
cd "C:\Datastore\output"
