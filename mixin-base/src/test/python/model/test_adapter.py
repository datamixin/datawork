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
from unittest import TestCase
from mixin.model.adapter import AdapterList
from model.mock_adapter import MockAdapter


class TestAdapterList(TestCase):
    @classmethod
    def setUpClass(cls):
        cls._list = AdapterList()
        cls._adapter = MockAdapter()

    def test_01_add(self):
        TestAdapterList._list.add(TestAdapterList._adapter)

    def test_02_add_same(self):
        TestAdapterList._list.add(TestAdapterList._adapter)

    def test_03_size(self):
        self.assertEquals(1, TestAdapterList._list.size())

    def test_04_indexOf(self):
        self.assertEquals(0, TestAdapterList._list.indexOf(TestAdapterList._adapter))

    def test_05_get(self):
        self.assertEquals(TestAdapterList._adapter, TestAdapterList._list.get(0))

    def test_06_remove(self):
        self.assertEquals(True, TestAdapterList._list.remove(TestAdapterList._adapter))
        self.assertEquals(False, TestAdapterList._list.remove(TestAdapterList._adapter))

    def test_07_size_remove(self):
        self.assertEquals(0, TestAdapterList._list.size())

    @classmethod
    def teadDownClass(cls):
        cls._list = None
        cls._adapter = None
