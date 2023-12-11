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
class Namespace:
    def __init__(self, name: str, URI: str):
        self._name = name
        self._URI = URI

    def getName(self) -> str:
        return self._name

    def getURI(self) -> str:
        return self._URI

    def __str__(self) -> str:
        return "{} {{}}".format(self._name, self._URI)
