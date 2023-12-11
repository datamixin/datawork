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
import unittest
import pandas as pd
from unittest import TestCase

from garut.functions.source.create_dataset import CreateDataset


class TestCreateDataset(TestCase):
    def testCreateDatasetFromList(self):
        function = CreateDataset()
        result: pd.DataFrame = function.execute(None, {CreateDataset.RESULT: [1, 2, 3]})
        self.assertTrue(2, len(result))
        self.assertEqual("item", result.columns[0])


if __name__ == "__main__":
    unittest.main()
