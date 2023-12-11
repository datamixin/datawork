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
from typing import Dict, List

from pandas import DataFrame
from garut.bearer import Bearer
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.function import FunctionRegistry
from garut.functions.dataset.dataset_function import DatasetFunction


class JoinRows(DatasetFunction):

    FUNCTION_NAME = "JoinRows"

    TYPE_INNER = "inner"
    TYPE_LEFT = "left"
    TYPE_RIGHT = "right"
    TYPE_FULL = "outer"

    LEFT_KEYS = "leftKeys"
    RIGHT_DATASET = "rightDataset"
    RIGHT_KEYS = "rightKeys"
    TYPE = "type"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        # Datasets
        leftDataset = self.getDataset(options)
        rightDataset: DataFrame = options.get(JoinRows.RIGHT_DATASET, None)
        if isinstance(rightDataset, Bearer):
            rightDataset = rightDataset.getResult()

        # Keys
        leftKeys: List[str] = options[JoinRows.LEFT_KEYS]
        rightKeys: List[str] = options[JoinRows.RIGHT_KEYS]

        # Index
        type = options.get(JoinRows.TYPE, JoinRows.TYPE_INNER)
        suffixes = ["_left", "_right"]
        rightIndexed = rightDataset.set_index(rightKeys)

        # Merge
        result = leftDataset.merge(
            rightIndexed, how=type, left_on=leftKeys, right_on=rightKeys, right_index=True, suffixes=suffixes
        )

        # Type setting
        for i in range(len(leftKeys)):
            leftKey = leftKeys[i]
            rightKey = rightKeys[i]
            if leftDataset[leftKey].dtype == rightDataset[rightKey].dtype:
                result[leftKey] = result[leftKey].astype(leftDataset[leftKey].dtype)

        return result


parameters = [DatasetFunction.DATASET, JoinRows.LEFT_KEYS, JoinRows.RIGHT_DATASET, JoinRows.RIGHT_KEYS, JoinRows.TYPE]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(JoinRows.FUNCTION_NAME, JoinRows, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(JoinRows.FUNCTION_NAME)
