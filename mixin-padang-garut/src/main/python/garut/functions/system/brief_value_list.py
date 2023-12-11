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
import pandas as pd
import collections as coll
from typing import Dict, List
from garut.bearer import Bearer
from garut.briefer import BrieferCatalog
from garut.contexts.context import Context
from garut.functions.function import Function, FunctionRegistry
from dataminer_pb2 import *
from value_pb2 import *


class BriefValueList(Function):

    FUNCTION_NAME = "BriefValueList"

    VALUE = "value"
    NAME = "name"

    def execute(self, context: Context, options: Dict[str, any]) -> any:
        value = options[BriefValueList.VALUE]
        if isinstance(value, Bearer):
            value = value.getResult()
        catalog = BriefValueListReaderCatalog.getInstance()
        reader = catalog.get(value)
        list = reader.read(value)
        return list


options = [BriefValueList.VALUE]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(BriefValueList.FUNCTION_NAME, BriefValueList, options)


class BriefValueListReader:
    def read(self, data: any) -> any:
        return []


class DefaultBriefValueListReader(BriefValueListReader):
    def read(self, data: any) -> any:
        array: List[any] = []
        briefer = BrieferCatalog.getInstance()
        if isinstance(data, coll.Iterable):
            for i in range(len(data)):
                field = data[i]
                brief = briefer.readWithKey(field, i)
                array.append(brief)
        elif hasattr(data, "__dict__"):
            dict = vars(data)
            for key in dict.keys():
                field = getattr(data, key)
                brief = briefer.readWithKey(field, key)
                array.append(brief)
        else:
            members = inspect.getmembers(type(data))
            for member in members:
                name = member[0]
                attr = member[1]
                if inspect.isgetsetdescriptor(attr):
                    field = getattr(data, name)
                    brief = briefer.readWithKey(field, name)
                    array.append(brief)
        return array


class BriefValueListReaderCatalog:
    instance = None

    def __init__(self):
        if BriefValueListReaderCatalog.instance != None:
            raise Exception("Use BriefValueListReaderCatalog.getInstance()")
        BriefValueListReaderCatalog.instance = self
        self._defaultReader = DefaultBriefValueListReader()
        self._readers: Dict[str, BriefValueListReader] = {}

    def getInstance():
        if BriefValueListReaderCatalog.instance == None:
            BriefValueListReaderCatalog()
        return BriefValueListReaderCatalog.instance

    def register(self, name: str, reader: BriefValueListReader):
        self._readers[name] = reader

    def isExists(self, name: str) -> bool:
        return self._readers.get(name, None) is not None

    def get(self, data: any) -> BriefValueListReader:
        name = type(data).__name__
        reader = self._readers.get(name, None)
        if not reader:
            return self._defaultReader
        return reader


class TableBriefValueListReader(BriefValueListReader):
    def read(self, data: pd.DataFrame) -> List[any]:
        array: List[any] = []
        for column in data.columns.values:
            ctypeName = data[column].dtype.type.__name__.lower()
            brief = DataminerBrief()
            brief.type = ctypeName
            brief.simple = False
            brief.propose = "column"
            if len(data[column]) > 0:
                uniques = data[column].unique()
                count = min(3, len(uniques))
                flag = "E.g., " if count < len(uniques) else ""
                items = ", ".join([str(item) for item in uniques[:count]])
                brief.digest = "{}{}".format(flag, items)
            else:
                brief.digest = "Empty"
            brief.key = column
            value = DataminerValue()
            value.brief.CopyFrom(brief)
            array.append(value)
        return array


class ObjectBriefValueListReader(BriefValueListReader):
    def read(self, source: Dict[str, any]) -> any:
        array: List[any] = []
        for key in source.keys():
            field = source.get(key)
            briefer = BrieferCatalog.getInstance()
            value = briefer.readWithKey(field, key)
            array.append(value)
        return array


catalog = BriefValueListReaderCatalog.getInstance()
catalog.register(dict.__name__, ObjectBriefValueListReader())
catalog.register(pd.DataFrame.__name__, TableBriefValueListReader())
