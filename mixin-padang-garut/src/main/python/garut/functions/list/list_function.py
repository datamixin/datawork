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
import numpy as np
import pandas as pd
from typing import Dict, List
from garut.bearer import Bearer
from garut.functions.function import Function


class ListFunction(Function):

    LIST = "list"

    def getList(self, options: Dict[str, any]) -> Dict:

        # Checking
        list = options.get(ListFunction.LIST, None)
        if list is None:
            raise Exception("Required 'list' option")
        if isinstance(list, Exception):
            raise list
        if isinstance(list, Bearer):
            list = list.getResult()

        # Pandas series
        if isinstance(list, pd.Series) or isinstance(list, np.ndarray):
            return list
        elif isinstance(list, pd.DataFrame):
            if len(list.columns) == 1:
                column = list.columns[0]
                return list[column]
            else:
                raise Exception("Unexpected 'list' by dataFrame with one column")

        # Ordinary list
        if isinstance(list, List) or isinstance(list, str):
            return list
        else:
            raise Exception("Unexpected 'list' option type {}".format(type(list)))
