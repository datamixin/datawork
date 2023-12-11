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

from typing import Dict
from garut.converter import ObjectConverter
from dataminer_pb2 import *
from value_pb2 import *


class Exporter:
    def export(self, object: any) -> DataminerValue:
        raise Exception("export not implemented at {}".format(self.__class__.__name__))

    @property
    def label(self):
        raise Exception("label not implemented at {}".format(self.__class__.__name__))

    @property
    def extension(self):
        raise Exception("extension not implemented at {}".format(self.__class__.__name__))


class ExporterListRegistry:
    instance = None

    def __init__(self):
        if ExporterListRegistry.instance != None:
            raise Exception("Use ExporterFactory.getInstance()")
        ExporterListRegistry.instance = self
        self._exporters: Dict[str, Dict[str, Exporter]] = {}

    def getInstance():
        if ExporterListRegistry.instance == None:
            ExporterListRegistry()
        return ExporterListRegistry.instance

    def register(self, name: str, exporter: Exporter):
        if name not in self._exporters:
            self._exporters[name] = {}
        exporters = self._exporters[name]
        exporters[exporter.extension] = exporter

    def getFormatList(self, source: any) -> Dict[str, str]:
        name = type(source).__name__
        exporters = self._exporters.get(name, None)
        list: Dict[str, str] = {}
        if exporters is not None:
            for extension in exporters.keys():
                exporter = exporters[extension]
                list[extension] = exporter.label
        return list

    def getFormatListValue(self, source: any) -> DataminerValue:
        object = self.getFormatList(source)
        converter = ObjectConverter()
        value = converter.toValue(object)
        response = FormatListResponse()
        response.list.CopyFrom(value.object)
        return response

    def getExporter(self, source: any, extension: str) -> Exporter:
        name = type(source).__name__
        exporters = self._exporters.get(name, None)
        if exporters is None:
            message = "Missing exporter list for '{}'".format(name)
            raise Exception(message)
        if extension not in exporters.keys():
            message = "Missing '{}' exporter for '{}' extension".format(name, extension)
            raise Exception(message)
        return exporters[extension]

    def export(self, source: any, format: str) -> DataminerBytes:
        exporter: Exporter = registry.getExporter(source, format)
        value = exporter.export(source)
        response = ExportResponse()
        response.value.CopyFrom(value)
        return response


class CSVExporter(Exporter):
    def export(self, dataFrame: pd.DataFrame) -> DataminerValue:
        value = DataminerValue()
        value.text.value = dataFrame.to_csv(index=False)
        return value

    @property
    def label(self):
        return "CSV"

    @property
    def extension(self):
        return "csv"


registry = ExporterListRegistry.getInstance()
registry.register(pd.DataFrame.__name__, CSVExporter())
