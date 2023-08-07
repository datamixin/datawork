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
Eclipse generate grpc java source files
# maven "generate-sources"

Macos generate grpc python source files
# python -m grpc_tools.protoc --proto_path=src/main/proto --grpc_python_out=src/main/python-gen --python_out=src/main/python-gen src/main/proto/datastore.proto

Create virtual environment .venv folder
# python -m venv .venv

View > Command Pallete... > Python: Select Interpreter > Entire Workspace > Python at .venv
# pip install -r src/main/python/requirements.txt

How to build datastore without vscode (windows)
```
D:
cd D:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python
copy env .env /Y
call pipenv install
call pipenv install --dev
call pipenv run python -m grpc_tools.protoc --proto_path=D:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto --grpc_python_out=D:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen --python_out=D:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python-gen D:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\proto\datastore.proto
```

How to run datastore without vscode (windows) - after build
```
D:
cd D:\Development\Andia\mixin-prediction\mixin-padang-garut\src\main\python
call pipenv run python garut\datastore.py
```