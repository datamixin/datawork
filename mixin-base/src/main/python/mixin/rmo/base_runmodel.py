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
from mixin.rmo.runmodel import Runmodel
from mixin.model.eobject import EObject
from mixin.rmo.outset import OutsetFactory
from mixin.rmo.indication import Indication
from mixin.rmo.supervisor import Supervisor
from mixin.rmo.modification import Modification
from mixin.rmo.root_regulator import RootRegulator
from mixin.rmo.eobject_modifier import EObjectModifier
from mixin.rmo.regulator import Regulator, RegulatorFactory


class BaseRunmodel(Runmodel):
    def __init__(self):
        super().__init__()
        self._regulatorFactory: RegulatorFactory = None
        self._outsetFactory: OutsetFactory = None
        self._capabilities: Dict[any, any] = {}
        self._rootRegulator: RootRegulator = RootRegulator()
        self._rootRegulator.setRunmodel(self)

    def setRegulatorFactory(self, factory: RegulatorFactory):
        self._regulatorFactory = factory

    def setOutsetFactory(self, factory: OutsetFactory):
        self._outsetFactory = factory

    def getModel(self) -> any:
        contents: Regulator = self._rootRegulator.getContents()
        return contents.getModel()

    def modify(self, modification: Modification):
        regulator: Regulator = self._rootRegulator.getContents()
        model: any = regulator.getModel()
        if isinstance(model, EObject):
            modifier: EObjectModifier = EObjectModifier(modification)
            modifier.modify(model)

    def getRegulatorFactory(self) -> RegulatorFactory:
        return self._regulatorFactory

    def getOutsetFactory(self) -> OutsetFactory:
        return self._outsetFactory

    def registerCapability(self, capabilityClass: any, service: any):
        self._capabilities[capabilityClass] = service

    def getCapability(self, capabilityClass: any) -> any:

        capability: any = self._capabilities.get(capabilityClass)

        # Cari menggunakan class sebagai interface
        if capability is None:
            for keyClass in self._capabilities.keys():
                value: any = self._capabilities[keyClass]
                valueClass: any = type(value)
                if issubclass(keyClass, capabilityClass):
                    capability = value
                    break
                if issubclass(valueClass, capabilityClass):
                    capability = value
                    break

        return capability

    def getRootRegulator(self) -> RootRegulator:
        return self._rootRegulator

    def getSupervisor(self) -> Supervisor:
        return self._rootRegulator.getContents()

    def postIndication(self, indication: Indication):
        pass

    def postRectification(self, rectification: Modification):
        pass
