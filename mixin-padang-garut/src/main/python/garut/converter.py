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
from typing import Dict, List, Tuple
import numpy as np
import pandas as pd
import datetime as datetime
import pandas.io.formats.format as format
from garut.bearer import Bearer
from garut.prototype import Prototype
from garut.briefer import BrieferCatalog
from value_pb2 import *


class Converter:

    DATE = "date"
    LIST = "list"
    NULL = "null"
    OBJECT = "object"
    STRING = "string"
    BOOLEAN = "boolean"
    NUMBER = "number"
    INT32 = "int32"
    INT64 = "int64"
    ERROR = "error"
    FLOAT32 = "float32"
    FLOAT64 = "float64"
    TIMESTAMP = "timestamp"
    DATETIME = "datetime"
    DATETIME_64 = "datetime64"
    DATETIME_64MS = "datetime64[ms]"
    DATETIME_UNIT_MS = "ms"
    DATETIME_UNIT_NS = "ns"

    def toValue(self, object: any) -> DataminerValue:
        raise Exception("toValue not implemented at {}".format(self.__class__.__name__))

    def setValue(self, value: DataminerValue, object: any):
        raise Exception("setValue not implemented at {}".format(self.__class__.__name__))


class StructureConverter(Converter):
    pass


class ConverterRegistry:
    instance = None

    def __init__(self):
        if ConverterRegistry.instance != None:
            raise Exception("Use ConverterFactory.getInstance()")
        ConverterRegistry.instance = self
        self._converters: Dict[str, Converter] = {}

    def getInstance():
        if ConverterRegistry.instance == None:
            ConverterRegistry()
        return ConverterRegistry.instance

    def register(self, name: str, converter: Converter):
        lower = name.lower()
        self._converters[lower] = converter

    def getConverter(self, name: str) -> Converter:
        lower = name.lower()
        converter = self._converters.get(lower, None)
        if converter is None:
            return defaultConverter
        return converter

    def getValueConverter(self, value: any, dtype: str = None, brief: bool = False) -> Tuple[any, Converter]:

        # Already
        if isinstance(value, DataminerValue):
            return value, dataminerValueConverter

        # Extract
        if isinstance(value, Bearer):
            value = value.getResult()

        # Intercept
        if isinstance(value, Exception):
            return value, errorConverter
        if isinstance(value, Prototype):
            return value, prototypeConverter
        if value is None:
            return value, nullConverter

        # Identification
        if dtype is not None:
            name = dtype
        else:
            name = type(value).__name__

        # Converter
        converter = self.getConverter(name)
        if brief == True:
            if isinstance(converter, StructureConverter):

                # Nested
                catalog = BrieferCatalog.getInstance()
                briefer = catalog.get(value)
                value = briefer.read(value)
                return self.getValueConverter(value, dtype, False)

        return value, converter

    def toValue(self, value: any, dtype: str = None, brief: bool = False) -> DataminerValue:
        value, converter = self.getValueConverter(value, dtype, brief)
        result = converter.toValue(value)
        return result


class NullConverter(Converter):

    NONE = DataminerNone()
    VALUE = DataminerValue()
    VALUE.none.CopyFrom(NONE)

    def toValue(self, object: str):
        return NullConverter.VALUE

    def setValue(self, value: DataminerValue, object: str):
        value.null.value = None


class StringConverter(Converter):
    def toValue(self, object: str):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: str):
        target.text.value = str(object)


class BoolConverter(Converter):
    def toValue(self, object: bool):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: str):
        target.logical.value = object


class Int32Converter(Converter):
    def toValue(self, object: int):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: str):
        target.number.int32 = object
        target.number.subtype = Converter.INT32


class Int64Converter(Converter):
    def toValue(self, object: np.int64):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: str):
        target.number.int64 = object
        target.number.subtype = Converter.INT64


class FloatConverter(Converter):
    def toValue(self, object: float):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: str):
        target.number.float = object
        target.number.subtype = Converter.FLOAT32


class DoubleConverter(Converter):
    def toValue(self, object: np.float64):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, value: DataminerValue, object: str):
        value.number.double = object
        value.number.subtype = Converter.FLOAT64


class TimestampConverter(Converter):
    def toValue(self, object: pd.Timestamp):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: any):
        if isinstance(object, pd.Timestamp):
            target.number.int64 = np.int64(object.timestamp() * 1e3)
        elif isinstance(object, np.datetime64):
            target.number.int64 = object.astype(Converter.DATETIME_64MS).astype("int64")
        else:
            target.number.int64 = object.astype("int64")
        target.number.subtype = Converter.TIMESTAMP


class DatetimeConverter(Converter):
    def toValue(self, object: np.datetime64):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: np.datetime64):
        target.number.int64 = object.astype(Converter.DATETIME_64MS).astype("int64")
        target.number.subtype = Converter.DATETIME


class DateConverter(Converter):
    def toValue(self, object: datetime.date):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, value: DataminerValue, object: np.datetime64):
        value.number.int64 = object.astype(Converter.DATETIME_64MS).astype("int64")
        value.number.subtype = Converter.DATE


class ListConverter(StructureConverter):
    def toValue(self, object: List[any]):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, object: List[any]):
        list = DataminerList()
        for item in object:
            element = list.element.add()
            result = registry.toValue(item)
            element.CopyFrom(result)
        target.list.CopyFrom(list)


class ObjectConverter(StructureConverter):
    def toValue(self, object: Dict[str, any]):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, source: Dict[str, any]):
        object = DataminerObject()
        for key in source.keys():
            property = object.property.add()
            property.key = str(key)
            value = source[key]
            result = registry.toValue(value)
            property.value.CopyFrom(result)
        target.object.CopyFrom(object)


class TableConverter(StructureConverter):
    def toValue(self, dataFrame: pd.DataFrame):
        value = DataminerValue()
        self.setValue(value, dataFrame)
        return value

    def setValue(self, target: DataminerValue, dataFrame: pd.DataFrame) -> DataminerValue:

        table = DataminerTable()
        converters: Dict[str, Converter] = {}
        indexType = str(dataFrame.index.dtype)

        # Buat columns
        field = table.column.add()
        field.name = "RowLabel"
        field.type = indexType
        indexConverter = registry.getConverter(indexType)
        for column in dataFrame.columns:
            field = table.column.add()
            if isinstance(column, int):
                field.index = column
            else:
                field.name = str(column)
            ctype = dataFrame.dtypes[column].type
            if ctype == np.datetime64:
                if format.is_dates_only(dataFrame[column]) is True:
                    ctypeName = Converter.DATE
                else:
                    ctypeName = Converter.DATETIME_64
            else:
                ctypeName = ctype.__name__.lower()
            field.type = ctypeName
            converters[column] = registry.getConverter(ctypeName)

        # All index
        for i in range(len(dataFrame)):

            # Read index
            label = dataFrame.index.values[i]

            # Convert index
            record = table.record.add()
            cell = record.value.add()
            indexConverter.setValue(cell, label)

        # All column
        for column in dataFrame.columns:

            # All values
            vector = dataFrame[column].values
            converter = converters[column]
            for i in range(len(dataFrame)):

                # Read value
                field = vector[i]

                # Convert value
                cell = table.record[i].value.add()
                if field is pd.NA:
                    cell.none.CopyFrom(NullConverter.NONE)
                else:
                    if isinstance(converter, ObjectConverter):
                        if isinstance(field, Exception):
                            errorConverter.setValue(cell, field)
                        elif field is None:
                            cell.none.CopyFrom(NullConverter.NONE)
                        else:
                            field, actual = registry.getValueConverter(field, None, True)
                            actual.setValue(cell, field)
                    else:
                        converter.setValue(cell, field)

        target.table.CopyFrom(table)


class ErrorConverter(Converter):
    def toValue(self, object: str):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, source: Exception):
        target.error.message = str(source)


class DataminerValueConverter(Converter):
    def toValue(self, value: DataminerValue):
        return value

    def setValue(self, target: DataminerValue, source: DataminerValue):
        target.CopyFrom(source)


class DefaultConverter(Converter):
    def toValue(self, object: str):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, source: any):
        brief = DataminerBrief()
        brief.type = type(source).__name__
        target.brief.CopyFrom(brief)


class PrototypeConverter(Converter):
    def toValue(self, object: str):
        value = DataminerValue()
        self.setValue(value, object)
        return value

    def setValue(self, target: DataminerValue, source: Prototype):
        target.prototype.definition = source.getLiteral()


nullConverter = NullConverter()
errorConverter = ErrorConverter()
stringConverter = StringConverter()
defaultConverter = DefaultConverter()
prototypeConverter = PrototypeConverter()
dataminerValueConverter = DataminerValueConverter()

registry = ConverterRegistry.getInstance()
registry.register(str.__name__, StringConverter())
registry.register(bool.__name__, BoolConverter())
registry.register(int.__name__, Int64Converter())
registry.register(np.str_.__name__, StringConverter())
registry.register(np.bool_.__name__, BoolConverter())
registry.register(np.object_.__name__, ObjectConverter())
registry.register(np.int32.__name__, Int32Converter())
registry.register(np.int64.__name__, Int64Converter())
registry.register(np.float32.__name__, FloatConverter())
registry.register(np.float64.__name__, DoubleConverter())
registry.register(np.ndarray.__name__, ListConverter())
registry.register(np.longlong.__name__, Int64Converter())
registry.register(float.__name__, FloatConverter())
registry.register(list.__name__, ListConverter())
registry.register(tuple.__name__, ListConverter())
registry.register(dict.__name__, ObjectConverter())
registry.register(pd.Series.__name__, ListConverter())
registry.register(pd.DataFrame.__name__, TableConverter())
registry.register(pd.Timestamp.__name__, TimestampConverter())
registry.register(np.datetime64.__name__, DatetimeConverter())
registry.register(pd.Int32Dtype.__name__, Int32Converter())
registry.register(pd.Int64Dtype.__name__, Int64Converter())
registry.register(datetime.date.__name__, DateConverter())
registry.register(Exception.__name__, ErrorConverter())

registry.register(Converter.STRING, StringConverter())
registry.register(Converter.OBJECT, ObjectConverter())
registry.register(Converter.DATETIME, DatetimeConverter())
