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
from unittest import TestCase
from mixin.model.notification import Notification
from model.mock_adapter import MockAdapter
from model.mock_eobject import MockEObject
from model.fake_eobject import FakeEObject


class TestBasicEObject(TestCase):
    @classmethod
    def setUpClass(cls):

        # List
        cls._parent_1_name = "parent_1"
        cls._parent_1 = MockEObject()
        cls._parent_1.setName(cls._parent_1_name)

        cls._parent_2 = MockEObject()
        cls._parent_2.setName("parent_2")

        cls._nested = FakeEObject()

        # Object Adapter
        cls._adapter_1 = MockAdapter()
        adapters_1 = TestBasicEObject._parent_1.eAdapters()
        adapters_1.add(cls._adapter_1)

        # Backup Adapter
        cls._adapter_2 = MockAdapter()
        adapters_2 = TestBasicEObject._parent_2.eAdapters()
        adapters_2.add(cls._adapter_2)

    def test_01_set_name(self):

        # Set parent_1 name
        name = TestBasicEObject._parent_1_name
        TestBasicEObject._parent_1.setName(name)
        self.assertEquals(1, TestBasicEObject._adapter_1.notifications)
        self.assertEquals(name, TestBasicEObject._parent_1.getName())

        # Notification
        notification = TestBasicEObject._adapter_1.last_notification
        self.assertEquals(Notification.SET, notification.getEventType())
        self.assertEquals(MockEObject.FEATURE_NAME, notification.getFeature())
        self.assertEquals(TestBasicEObject._parent_1, notification.getNotifier())
        self.assertEquals(name, notification.getNewValue())
        self.assertEquals(TestBasicEObject._parent_1_name, notification.getOldValue())
        self.assertEquals(-1, notification.getListPosition())
        self.assertIsNone(notification.getMapKey())

    def test_02_set_fake_to_parent_1(self):

        # Set fake to parent 1
        TestBasicEObject._parent_1.setFake(TestBasicEObject._nested)
        self.assertEquals(2, TestBasicEObject._adapter_1.notifications)
        self.assertEquals(TestBasicEObject._nested, TestBasicEObject._parent_1.getFake())
        self.assertEquals(TestBasicEObject._parent_1, TestBasicEObject._nested.eContainer())

        # Notification
        notification = TestBasicEObject._adapter_1.last_notification
        self.assertEquals(Notification.SET, notification.getEventType())
        self.assertEquals(TestBasicEObject._nested, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())

    def test_03_set_fake_to_parent_2(self):

        # Move nested from object to backup
        TestBasicEObject._parent_2.setFake(TestBasicEObject._nested)
        self.assertEquals(1, TestBasicEObject._adapter_2.notifications)
        self.assertEquals(TestBasicEObject._nested, TestBasicEObject._parent_2.getFake())
        self.assertEquals(TestBasicEObject._parent_2, TestBasicEObject._nested.eContainer())

        self.assertEquals(3, TestBasicEObject._adapter_1.notifications)
        self.assertIsNone(TestBasicEObject._parent_1.getFake())

        # Notification
        notification = TestBasicEObject._adapter_2.last_notification
        self.assertEquals(Notification.SET, notification.getEventType())
        self.assertEquals(TestBasicEObject._nested, notification.getNewValue())
        self.assertIsNone(notification.getOldValue())

    @classmethod
    def teadDownClass(cls):
        cls._parent_1 = None
