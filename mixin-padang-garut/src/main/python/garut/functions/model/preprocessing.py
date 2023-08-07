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
import pandas as pd

from typing import Dict, List
from garut.parameter import Parameter
from garut.contexts.context import Context
from garut.instruction import InstructionFactory
from garut.functions.encoder.encoder import Encoder
from garut.functions.model.transmute import Transmutation
from garut.functions.dataset.encode_column import EncodeColumn
from garut.functions.function import Function, FunctionRegistry


class Preprocessing(Function):

    FUNCTION_NAME = "Preprocessing"

    MUTATIONS = "mutations"
    ENCODERS = "encoders"
    TRAINING = "training"
    ENCODERD_FIELD = "Encoders"
    RESULT_FIELD = "Result"

    def execute(self, context: Context, options: Dict[str, any]) -> any:

        mutations: List[Transmutation] = self.get(options, Preprocessing.MUTATIONS)
        training = self.get(options, Preprocessing.TRAINING)
        incoders = self.get(options, Preprocessing.ENCODERS)
        outcoders: Dict[int, Encoder] = {}
        dataset: pd.DataFrame = None

        for index in range(len(mutations)):

            # Encoder
            mutation = mutations[index]
            encoder: Encoder = None
            if mutation.operation == EncodeColumn.FUNCTION_NAME:
                if EncodeColumn.ENCODER in mutation.options:
                    encoder = mutation.options.get(EncodeColumn.ENCODER)
            if encoder is not None:
                if training:
                    outcoders[index] = encoder.retain()
                else:
                    if index in incoders:
                        incoder = incoders[index]
                        encoder.assign(incoder)
                    else:
                        raise Exception("Required encoder for operation {}".format(index))

            # Instruction
            factory = InstructionFactory.getInstance()
            instruction = factory.create(mutation.operation)
            dataset = instruction.execute(context, dataset, mutation.options)

        # Result
        if training is True:
            return {Preprocessing.ENCODERD_FIELD: outcoders, Preprocessing.RESULT_FIELD: dataset}
        else:
            return dataset


parameters = [
    Preprocessing.MUTATIONS,
    Parameter(Preprocessing.TRAINING, bool, True),
    Parameter(Preprocessing.ENCODERS, list, []),
]
registry: FunctionRegistry = FunctionRegistry.getInstance()
registry.register(Preprocessing.FUNCTION_NAME, Preprocessing, parameters)
