#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.#
import grpc
from filestore_pb2_grpc import FilestoreStub
from filestore_pb2 import *


class Filestore:
    def __init__(self, filestore: str) -> None:
        self._channel = grpc.insecure_channel(filestore)
        self._stub = FilestoreStub(self._channel)

    def exists(self, path: str, current: str) -> bool:
        request = PathRequest(path=path, current=current)
        response = self._stub.resolve(request)
        return response.resolved and response.file

    def untitled(self, path: str, current: str) -> bool:
        request = PathRequest(path=path, current=current)
        response = self._stub.untitled(request)
        return response.exists

    def identify(self, path: str, current: str) -> str:
        request = PathRequest(path=path, current=current)
        response = self._stub.identify(request)
        return response.uuid

    def name(self, key: str) -> str:
        request = NameRequest(uuid=key)
        response = self._stub.name(request)
        return response.name

    def credential(self, group: str, name: str) -> str:
        request = CredentialRequest(group=group, name=name)
        response = self._stub.credential(request)
        return response.credential
