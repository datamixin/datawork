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
import pandas as pd
import pandas.core.groupby as groupby

from typing import Dict, List
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.invocations.invocation import Invocation
from garut.functions.function import FunctionRegistry
from garut.contexts.group_by_context import GroupByContext
from garut.contexts.data_frame_context import DataFrameContext
from garut.functions.dataset.dataset_function import DatasetFunction


class GroupRows(DatasetFunction):

    FUNCTION_NAME = "GroupRows"

    KEYS = "keys"
    VALUES = "values"
    ALIAS = "alias"
    AGGREGATE = "aggregate"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        dataset: pd.DataFrame = self.getDataset(options)
        keys = options[GroupRows.KEYS]
        values: Dict[str, any] = options[GroupRows.VALUES]
        aggregationSet = AggregationSet()
        for value in values:
            alias = value[GroupRows.ALIAS]
            aggregate = value[GroupRows.AGGREGATE]
            aggregation = Aggregation(context, alias, aggregate)
            aggregationSet.append(aggregation)
        if len(keys) > 0:
            groupby = dataset.groupby(keys)
            result = aggregationSet(groupby)
            result = result.reset_index()
        else:
            result = aggregationSet(dataset)
            result = result.transpose()
            result = result.reset_index()
            result = result[[alias]]

        result = self.forceObjectToString(result)
        return result


class Aggregation:
    def __init__(self, context: Context, alias: str, aggregate: Invocation):
        self._context = context
        self._alias = alias
        self._aggregate = aggregate

    @property
    def alias(self):
        return self._alias

    def aggregate(self, value: any):
        if isinstance(value, groupby.DataFrameGroupBy):
            context = GroupByContext(self._context, value)
        else:
            context = DataFrameContext(self._context, value)
        return self._aggregate.invoke(context)


class AggregationSet:
    def __init__(self):
        self._aggregations: List[Aggregation] = []

    def append(self, aggregation: Aggregation):
        self._aggregations.append(aggregation)

    def __call__(self, value: any):
        data: Dict[str, any] = {}
        names: List[str] = []
        for aggregation in self._aggregations:
            names.append(aggregation.alias)
            data[aggregation.alias] = aggregation.aggregate(value)
        if isinstance(value, groupby.DataFrameGroupBy):
            return pd.DataFrame(data)
        else:
            return pd.DataFrame(data, index=names)


parameters = [DatasetFunction.DATASET, GroupRows.KEYS, GroupRows.VALUES]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(GroupRows.FUNCTION_NAME, GroupRows, parameters)

factory: InstructionFactory = InstructionFactory.getInstance()
factory.registerInstruction(GroupRows.FUNCTION_NAME)
