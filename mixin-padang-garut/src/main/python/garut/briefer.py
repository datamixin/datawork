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
import numbers
import numpy as np
import pandas as pd
import collections as coll
from typing import Dict, List
from value_pb2 import *


class Briefer:

    MIN_SIMPLE_STRING = 32

    def read(self, data: any) -> any:
        return None

    def _createBrief(
        self,
        dtype: str,
        simple: bool,
        children: int = 0,
        propose: str = None,
        digest: str = None,
        value: any = None,
        key: any = None,
    ) -> DataminerValue:
        brief = DataminerBrief()
        brief.type = dtype
        brief.simple = simple
        brief.children = children
        if propose is not None:
            brief.propose = propose
        if digest is not None:
            brief.digest = digest
        if value is not None:
            from garut.converter import ConverterRegistry

            registry = ConverterRegistry.getInstance()
            value = registry.toValue(value)
            brief.value.CopyFrom(value)
        if key is not None:
            brief.key = key
        value = DataminerValue()
        value.brief.CopyFrom(brief)
        return value


class DefaultBriefer(Briefer):
    def read(self, data: any) -> any:
        name = type(data).__name__
        children = 0
        if isinstance(data, coll.Iterable):
            children = len(data)
            name = list.__name__
        elif hasattr(data, "__dict__"):
            children = len(vars(data))
        else:
            members = inspect.getmembers(type(data))
            for member in members:
                attr = member[1]
                if inspect.isgetsetdescriptor(attr):
                    children = children + 1
        return self._createBrief(name, False, children)


class BrieferCatalog:
    instance = None

    def __init__(self):
        if BrieferCatalog.instance != None:
            raise Exception("Use BrieferCatalog.getInstance()")
        BrieferCatalog.instance = self
        self._defaultReader = DefaultBriefer()
        self._readers: Dict[str, Briefer] = {}

    def getInstance():
        if BrieferCatalog.instance == None:
            BrieferCatalog()
        return BrieferCatalog.instance

    def register(self, name: str, reader: Briefer):
        self._readers[name] = reader

    def isExists(self, name: str) -> bool:
        return self._readers.get(name, None) is not None

    def isSimple(self, data: any) -> bool:
        reader = self.get(data)
        return isinstance(reader, SimpleBriefer)

    def read(self, data: any) -> DataminerValue:
        reader = self.get(data)
        return reader.read(data)

    def readWithKey(self, data: any, key: str) -> DataminerValue:
        reader = self.get(data)
        value = reader.read(data)
        brief = value.brief
        brief.key = key
        return value

    def get(self, data: any) -> Briefer:
        if isinstance(data, numbers.Number):
            return simpleBriefer
        name = type(data).__name__
        reader = self._readers.get(name, None)
        if not reader:
            return self._defaultReader
        return reader


class TableBriefer(Briefer):
    def read(self, data: pd.DataFrame) -> any:
        dtype = "table"
        propose = "table"
        columns = len(data.columns)
        rows = len(data.index)
        digest = "{} columns, {} rows".format(columns, rows)
        return self._createBrief(dtype, False, columns, propose, digest)


class ObjectBriefer(Briefer):
    def read(self, source: Dict[str, any]) -> any:
        dtype = "object"
        propose = dtype
        fields = len(source.keys())
        digest = "{} fields".format(fields)
        return self._createBrief(dtype, False, fields, propose, digest)


class ColumnBriefer(Briefer):
    def read(self, column: pd.Series) -> any:
        ctypeName = column.dtype.type.__name__.lower()
        propose = "column"
        elements = len(column)
        digest = "{} values".format(elements)
        return self._createBrief(ctypeName, False, 0, propose, digest, None, column.name)


class ListBriefer(Briefer):
    def read(self, source: List[any]) -> any:
        dtype = "list"
        propose = dtype
        elements = len(source)
        digest = "{} elements".format(elements)
        return self._createBrief(dtype, False, elements, propose, digest)


class SimpleBriefer(Briefer):
    def read(self, data: any) -> any:
        dtype = type(data).__name__
        return self._createBrief(dtype, True, 0, dtype, None, data)


class StringBriefer(Briefer):
    def read(self, data: str) -> any:
        dtype = type(data).__name__
        chars = len(data)
        propose = dtype
        if chars > Briefer.MIN_SIMPLE_STRING:
            digest = "{} characters".format(chars)
            return self._createBrief(dtype, False, 0, propose, digest, data[: Briefer.MIN_SIMPLE_STRING])
        else:
            return self._createBrief(dtype, True, 0, propose, None, data)


catalog = BrieferCatalog.getInstance()
simpleBriefer = SimpleBriefer()

catalog.register(bool.__name__, simpleBriefer)
catalog.register(np.bool_.__name__, simpleBriefer)
catalog.register(pd.Timestamp.__name__, simpleBriefer)
catalog.register(np.datetime64.__name__, simpleBriefer)

catalog.register(str.__name__, StringBriefer())
catalog.register(np.str_.__name__, StringBriefer())
catalog.register(np.ndarray.__name__, ListBriefer())
catalog.register(list.__name__, ListBriefer())
catalog.register(dict.__name__, ObjectBriefer())
catalog.register(pd.Series.__name__, ColumnBriefer())
catalog.register(pd.DataFrame.__name__, TableBriefer())
