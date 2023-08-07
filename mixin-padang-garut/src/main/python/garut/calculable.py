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
from typing import List, Dict

from garut.parameter import Parameter
from garut.contexts.context import Context


class Calculable:
    def createParameters(self) -> List[Parameter]:
        raise Exception("{}.createParameters() not implemented".format(type(self).__name__))

    def calculate(self, parent: Context, options: Dict[str, any]) -> any:
        raise Exception("{}.calculate() not implemented".format(type(self).__name__))
