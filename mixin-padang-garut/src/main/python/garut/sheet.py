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
from garut.foresee import Foresee
from garut.storage import StorageFile
from dataminer_pb2 import *


class Sheet:
    def __init__(self, folder: StorageFile, foresee: Foresee):
        self._folder = folder
        self._foresee = foresee

    def getName(self) -> str:
        return self._folder.getName()

    def rename(self, name: str):
        self._folder.renameTo(name)

    def remove(self) -> any:
        self._folder.delete()

    @property
    def foresee(self):
        return self._foresee
