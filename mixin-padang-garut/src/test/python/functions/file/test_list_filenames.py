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
from unittest import TestCase

from garut.functions.file.list_filenames import ListFilenames


class TestListFilenames(TestCase):
    def testListFilenames(self):

        # List file at root project that contains pom.xml
        function = ListFilenames()
        result = function.execute(None, {ListFilenames.DIRECTORY: "./", ListFilenames.PATTERN: "*.xml"})

        self.assertTrue(isinstance(result, list))
        self.assertEqual(1, len(result))


if __name__ == "__main__":
    unittest.main()
