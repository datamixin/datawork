#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
from typing import Dict
from garut.bearer import Bearer
from garut.functions.function import Function


class ObjectFunction(Function):

    OBJECT = "object"

    def getObject(self, options: Dict[str, any]) -> Dict:
        output = options.get(ObjectFunction.OBJECT, None)
        if output is None:
            raise Exception("Required 'object' option")
        if isinstance(output, Exception):
            raise output
        if isinstance(output, Bearer):
            output = output.getResult()
        if isinstance(output, Dict):
            return output
        else:
            raise Exception("Unexpected 'object' option type {}".format(type(output)))
