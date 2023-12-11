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
import inspect
import numpy as np
import pandas as pd
import collections as coll
from garut.bearer import Bearer
from typing import Dict, List, Type
from garut.parameter import Parameter
from garut.briefer import BrieferCatalog
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry


class Example(Function):

    FUNCTION_NAME = "Example"

    VALUE = "value"
    COUNT = "count"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        value = options[Example.VALUE]
        count = options[Example.COUNT]
        if isinstance(value, Bearer):
            value = value.getResult()
        catalog = ExampleReaderCatalog.getInstance()
        reader = catalog.get(value)
        info = reader.read(value, count)
        return info


parameters = [Example.VALUE, Parameter(Example.COUNT, int, 10)]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Example.FUNCTION_NAME, Example, parameters)


class ExampleReader:
    def read(self, data: any, count: int) -> any:
        return None


class DefaultExampleReader(ExampleReader):
    def read(self, data: any, count: int) -> any:
        briefer = BrieferCatalog.getInstance()
        if isinstance(data, coll.Iterable):

            # ndarray 2 dimension
            if isinstance(data, np.ndarray):
                if len(data.shape) == 2:
                    example = data[: min(data.shape[0], count), : min(data.shape[1], count)]
                    return pd.DataFrame(example)

            # list 2 dimension
            return ListExampleReader.readList(data, count)

        elif hasattr(data, "__dict__"):
            dict = vars(data)
            object: Dict[str, any] = {}
            for key in dict.keys():
                field = getattr(data, key)
                brief = briefer.read(field)
                object[key] = brief
            return object
        if data is None:
            return "None"
        else:
            object: Dict[str, any] = {}
            members = inspect.getmembers(type(data))
            for member in members:
                name = member[0]
                attr = member[1]
                if inspect.isgetsetdescriptor(attr):
                    field = getattr(data, name)
                    brief = briefer.read(field)
                    object[name] = brief
            return object


class ExampleReaderCatalog:
    instance = None

    def __init__(self):
        if ExampleReaderCatalog.instance != None:
            raise Exception("Use ExampleReaderCatalog.getInstance()")
        ExampleReaderCatalog.instance = self
        self._defaultReader = DefaultExampleReader()
        self._readers: Dict[str, ExampleReader] = {}

    def getInstance():
        if ExampleReaderCatalog.instance == None:
            ExampleReaderCatalog()
        return ExampleReaderCatalog.instance

    def register(self, name: str, reader: ExampleReader):
        self._readers[name] = reader

    def isExists(self, name: str) -> bool:
        return self._readers.get(name, None) is not None

    def get(self, data: any) -> ExampleReader:
        name = type(data).__name__
        reader = self._readers.get(name, None)
        if not reader:
            return self._defaultReader
        return reader


class TableExampleReader(ExampleReader):
    def read(self, data: pd.DataFrame, count: int) -> any:
        return data.head(count)


class ObjectExampleReader(ExampleReader):
    def read(self, source: Dict[str, any], count: int) -> any:
        counter = 0
        object: Dict[str, any] = {}
        for key in source.keys():
            counter = counter + 1
            if counter > count:
                break
            else:
                field = source.get(key)
                catalog = BrieferCatalog.getInstance()
                if catalog.isSimple(field):
                    object[key] = field
                else:
                    object[key] = catalog.read(field)
        return object


class ListExampleReader(ExampleReader):
    def read(self, source: List[any], count: int) -> any:
        return ListExampleReader.readList(source, count)

    @staticmethod
    def readList(source: List[any], count: int) -> any:

        array: List[any] = []
        sizes: List[int] = []
        fields: List[any] = []
        for i in range(min(len(source), count)):
            field = source[i]
            if isinstance(field, np.ndarray):
                if len(field.shape) == 1:
                    size = len(field)
                    fields.append(field[: min(len(field), count)])
                    if size not in sizes:
                        sizes.append(size)
            briefer = BrieferCatalog.getInstance()
            if briefer.isSimple(field):
                array.append(field)
            else:
                value = briefer.read(field)
                array.append(value)

        if len(sizes) == 1:
            return pd.DataFrame(fields)
        else:
            return array


class SimpleExampleReader(ExampleReader):
    def read(self, data: any, count: int) -> any:
        return data


class StringExampleReader(ExampleReader):
    def read(self, data: str, count: int) -> any:
        chars = len(data)
        if chars <= count:
            return data
        else:
            catalog = BrieferCatalog.getInstance()
            return catalog.read(data)


catalog = ExampleReaderCatalog.getInstance()

catalog.register(bool.__name__, SimpleExampleReader())
catalog.register(int.__name__, SimpleExampleReader())
catalog.register(np.int32.__name__, SimpleExampleReader())
catalog.register(np.int64.__name__, SimpleExampleReader())
catalog.register(float.__name__, SimpleExampleReader())
catalog.register(np.float32.__name__, SimpleExampleReader())
catalog.register(np.float64.__name__, SimpleExampleReader())
catalog.register(pd.Timestamp.__name__, SimpleExampleReader())
catalog.register(np.datetime64.__name__, SimpleExampleReader())

catalog.register(str.__name__, StringExampleReader())
catalog.register(np.ndarray.__name__, ListExampleReader())
catalog.register(list.__name__, ListExampleReader())
catalog.register(dict.__name__, ObjectExampleReader())
catalog.register(pd.Series.__name__, ListExampleReader())
catalog.register(pd.DataFrame.__name__, TableExampleReader())
