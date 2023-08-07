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
from mixin.model.basic_emap import BasicEMap
from mixin.model.ereference import EReference
from mixin.model.notification import Notification
from model.mock_adapter import MockAdapter
from model.mock_eobject import MockEObject


class TestBasicEMap(TestCase):
    @classmethod
    def setUpClass(cls):

        # List
        cls._owner = MockEObject()
        cls._feature = EReference("map", MockEObject)
        cls._map = BasicEMap(cls._owner, cls._feature)

        # Child
        cls._childK = "child"
        cls._childV = MockEObject()
        cls._childV.setName("child")

        # Other
        cls._otherK = "other"
        cls._otherV = MockEObject()
        cls._otherV.setName("other")

        # Adapter
        cls._adapter = MockAdapter()
        adapters = TestBasicEMap._owner.eAdapters()
        adapters.add(cls._adapter)

    def test_01_put_child(self):

        # Set childK -> valueV
        TestBasicEMap._map.put(TestBasicEMap._childK, TestBasicEMap._childV)
        self.assertEquals(1, TestBasicEMap._adapter.notifications)
        self.assertEquals(1, TestBasicEMap._map.size())
        self.assertTrue(TestBasicEMap._map.containsKey(TestBasicEMap._childK))
        self.assertEquals(TestBasicEMap._childV, TestBasicEMap._map.get(TestBasicEMap._childK))

        # Notification
        notification = TestBasicEMap._adapter.last_notification
        self.assertEquals(Notification.SET, notification.getEventType())
        self.assertEquals(TestBasicEMap._feature, notification.getFeature())
        self.assertEquals(TestBasicEMap._owner, notification.getNotifier())
        self.assertEquals(TestBasicEMap._childV, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())
        self.assertEquals(-1, notification.getListPosition())
        self.assertEquals(TestBasicEMap._childK, notification.getMapKey())

    def test_02_put_again(self):

        # Set childK -> valueV again
        TestBasicEMap._map.put(TestBasicEMap._childK, TestBasicEMap._childV)
        self.assertEquals(2, TestBasicEMap._adapter.notifications)
        self.assertEquals(1, TestBasicEMap._map.size())
        self.assertEquals(TestBasicEMap._childV, TestBasicEMap._map.get(TestBasicEMap._childK))

        # Notification
        notification = TestBasicEMap._adapter.last_notification
        self.assertEquals(Notification.SET, notification.getEventType())
        self.assertEquals(TestBasicEMap._childV, notification.getNewValue())
        self.assertEquals(TestBasicEMap._childV, notification.getOldValue())
        self.assertEquals(TestBasicEMap._childK, notification.getMapKey())

    def test_03_put_other(self):

        # Set otherK -> otherV
        TestBasicEMap._map.put(TestBasicEMap._otherK, TestBasicEMap._otherV)
        self.assertEquals(3, TestBasicEMap._adapter.notifications)
        self.assertEquals(2, TestBasicEMap._map.size())
        self.assertEquals(TestBasicEMap._otherV, TestBasicEMap._map.get(TestBasicEMap._otherK))

        # Notification
        notification = TestBasicEMap._adapter.last_notification
        self.assertEquals(Notification.SET, notification.getEventType())
        self.assertEquals(TestBasicEMap._otherV, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())
        self.assertEquals(TestBasicEMap._otherK, notification.getMapKey())

    def test_04_remove_other(self):

        # Remove other
        TestBasicEMap._map.remove(TestBasicEMap._otherK)
        self.assertEquals(4, TestBasicEMap._adapter.notifications)
        self.assertEquals(1, TestBasicEMap._map.size())
        self.assertFalse(TestBasicEMap._map.containsKey(TestBasicEMap._otherK))

        # Notification
        notification = TestBasicEMap._adapter.last_notification
        self.assertEquals(Notification.REMOVE, notification.getEventType())
        self.assertEquals(TestBasicEMap._otherV, notification.getOldValue())
        self.assertIsNone(notification.getNewValue())
        self.assertEquals(TestBasicEMap._otherK, notification.getMapKey())

    def test_05_clear(self):

        # Clear
        TestBasicEMap._map.clear()
        self.assertEquals(5, TestBasicEMap._adapter.notifications)
        self.assertEquals(0, TestBasicEMap._map.size())
        self.assertFalse(TestBasicEMap._map.containsKey(TestBasicEMap._childK))

        # Notification
        notification = TestBasicEMap._adapter.last_notification
        self.assertEquals(Notification.REMOVE_MANY, notification.getEventType())

    @classmethod
    def teadDownClass(cls):
        cls._map = None
        cls._owner = None
