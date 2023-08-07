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
from garut.evaluations.evaluation import Evaluation
from garut.contexts.context import Context, BaseContext


class LetVariable:
    def __init__(self, name: str, evaluation: Evaluation):
        self._name = name
        self._result = None
        self._evaluation = evaluation

    @property
    def name(self):
        return self._name

    @property
    def evaluation(self):
        return self._evaluation

    def getResult(self, context: Context):
        if self._result is None:
            self._result = self._evaluation.evaluate(context)
        return self._result


class LetContext(BaseContext):
    def __init__(self, parent: Context, variables: Dict[str, LetVariable]):
        super().__init__(parent)
        self._variables = variables

    def isFieldExists(self, key: str) -> bool:
        if self._variables.get(key, None) is not None:
            return True
        else:
            return super().isFieldExists(key)

    def getField(self, key: str):
        if self._variables.get(key, None) is not None:
            variable = self._variables.get(key)
            return variable.getResult(self)
        else:
            return super().getField(key)

    def getFieldContext(self, key: str):
        if self._variables.get(key, None) is not None:
            return self
        else:
            return super().getFieldContext(key)
