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
from mixin.model.ereference import EReference
from mixin.model.basic_elist import BasicEList
from mixin.model.notification import Notification
from model.mock_adapter import MockAdapter
from model.mock_eobject import MockEObject


class TestBasicEList(TestCase):
    @classmethod
    def setUpClass(cls):

        # List
        cls._owner = MockEObject()
        cls._feature = EReference("list", MockEObject)
        cls._list = BasicEList(cls._owner, cls._feature)

        # Child
        cls._child = MockEObject()
        cls._child.setName("child")

        # Other
        cls._other = MockEObject()
        cls._other.setName("other")

        # Atall
        cls._atall = [MockEObject(), MockEObject()]
        cls._atall[0].setName("onall-1")
        cls._atall[1].setName("onall-2")

        # Range
        cls._range = [MockEObject(), MockEObject()]
        cls._range[0].setName("range-1")
        cls._range[1].setName("range-2")

        # Adapter
        cls._adapter = MockAdapter()
        adapters = TestBasicEList._owner.eAdapters()
        adapters.add(cls._adapter)

    def test_01_add_child(self):

        # Add child at 0
        TestBasicEList._list.add(TestBasicEList._child)
        self.assertEquals(1, TestBasicEList._adapter.notifications)

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.ADD, notification.getEventType())
        self.assertEquals(TestBasicEList._feature, notification.getFeature())
        self.assertEquals(TestBasicEList._owner, notification.getNotifier())
        self.assertEquals(TestBasicEList._child, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())
        self.assertEquals(0, notification.getListPosition())
        self.assertIsNone(notification.getMapKey())
        self.assertEquals(1, TestBasicEList._list.size())
        self.assertEquals(0, TestBasicEList._list.indexOf(TestBasicEList._child))
        self.assertEquals(TestBasicEList._child, TestBasicEList._list.get(0))

    def test_02_set_other(self):

        # Set other at 0
        TestBasicEList._list.set(0, TestBasicEList._other)
        self.assertEquals(2, TestBasicEList._adapter.notifications)

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.SET, notification.getEventType())
        self.assertEquals(TestBasicEList._other, notification.getNewValue())
        self.assertEquals(TestBasicEList._child, notification.getOldValue())
        self.assertEquals(0, notification.getListPosition())

    def test_03_add_child_at(self):

        # Add child at 0, other move to 1
        TestBasicEList._list.addAt(0, TestBasicEList._child)
        self.assertEquals(3, TestBasicEList._adapter.notifications)
        self.assertEquals(2, TestBasicEList._list.size())

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.ADD, notification.getEventType())
        self.assertEquals(TestBasicEList._child, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())
        self.assertEquals(0, notification.getListPosition())

    def test_04_move_0_to_1(self):

        # Move child to 1, other to 0
        TestBasicEList._list.move(TestBasicEList._child, 1)
        self.assertEquals(4, TestBasicEList._adapter.notifications)
        self.assertEquals(TestBasicEList._other, TestBasicEList._list.get(0))
        self.assertEquals(TestBasicEList._child, TestBasicEList._list.get(1))

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.MOVE, notification.getEventType())
        self.assertEquals(TestBasicEList._child, notification.getNewValue())
        self.assertEquals(TestBasicEList._child, notification.getOldValue())
        self.assertEquals(1, notification.getListPosition())

    def test_05_move_1_to_0(self):

        # Move child to 0, other to 1
        TestBasicEList._list.move(TestBasicEList._child, 0)
        self.assertEquals(5, TestBasicEList._adapter.notifications)
        self.assertEquals(TestBasicEList._child, TestBasicEList._list.get(0))
        self.assertEquals(TestBasicEList._other, TestBasicEList._list.get(1))

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.MOVE, notification.getEventType())
        self.assertEquals(TestBasicEList._child, notification.getNewValue())
        self.assertEquals(TestBasicEList._child, notification.getOldValue())
        self.assertEquals(0, notification.getListPosition())

    def test_06_remove_other(self):

        # Remove other
        TestBasicEList._list.remove(TestBasicEList._other)
        self.assertEquals(6, TestBasicEList._adapter.notifications)
        self.assertEquals(1, TestBasicEList._list.size())

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.REMOVE, notification.getEventType())
        self.assertIsNone(notification.getNewValue())
        self.assertEquals(TestBasicEList._other, notification.getOldValue())
        self.assertEquals(1, notification.getListPosition())

    def test_07_add_all(self):

        # Remove other
        TestBasicEList._list.addAll(TestBasicEList._atall)
        self.assertEquals(7, TestBasicEList._adapter.notifications)
        self.assertEquals(3, TestBasicEList._list.size())
        self.assertEquals(TestBasicEList._child, TestBasicEList._list.get(0))
        self.assertEquals(TestBasicEList._atall[0], TestBasicEList._list.get(1))
        self.assertEquals(TestBasicEList._atall[1], TestBasicEList._list.get(2))

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.ADD_MANY, notification.getEventType())
        self.assertEquals(TestBasicEList._atall, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())
        self.assertEquals(1, notification.getListPosition())

    def test_08_insert_range(self):

        # Remove other
        TestBasicEList._list.insertRange(TestBasicEList._range, 2)
        self.assertEquals(8, TestBasicEList._adapter.notifications)
        self.assertEquals(5, TestBasicEList._list.size())
        self.assertEquals(TestBasicEList._child, TestBasicEList._list.get(0))
        self.assertEquals(TestBasicEList._atall[0], TestBasicEList._list.get(1))
        self.assertEquals(TestBasicEList._range[0], TestBasicEList._list.get(2))
        self.assertEquals(TestBasicEList._range[1], TestBasicEList._list.get(3))
        self.assertEquals(TestBasicEList._atall[1], TestBasicEList._list.get(4))

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.ADD_MANY, notification.getEventType())
        self.assertEquals(TestBasicEList._range, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())
        self.assertEquals(2, notification.getListPosition())

    def test_09_remove_range(self):

        # Remove other
        TestBasicEList._list.removeRange(1, 3)
        self.assertEquals(9, TestBasicEList._adapter.notifications)
        self.assertEquals(3, TestBasicEList._list.size())
        self.assertEquals(TestBasicEList._child, TestBasicEList._list.get(0))
        self.assertEquals(TestBasicEList._range[1], TestBasicEList._list.get(1))
        self.assertEquals(TestBasicEList._atall[1], TestBasicEList._list.get(2))

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.REMOVE_MANY, notification.getEventType())
        self.assertIsNone(notification.getNewValue())
        self.assertEquals([TestBasicEList._atall[0], TestBasicEList._range[0]], notification.getOldValue())
        self.assertEquals(1, notification.getListPosition())

    def test_10_clear(self):

        # Remove other
        TestBasicEList._list.clear()
        self.assertEquals(10, TestBasicEList._adapter.notifications)
        self.assertEquals(0, TestBasicEList._list.size())
        self.assertEquals(True, TestBasicEList._list.isEmpty())
        self.assertEquals(False, TestBasicEList._list.contains(TestBasicEList._child))

        # Notification
        notification = TestBasicEList._adapter.last_notification
        self.assertEquals(Notification.REMOVE_MANY, notification.getEventType())
        self.assertEquals(-1, notification.getListPosition())

    @classmethod
    def teadDownClass(cls):
        cls._list = None
        cls._owner = None
