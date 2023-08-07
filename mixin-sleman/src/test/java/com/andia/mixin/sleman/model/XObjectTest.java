/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.andia.mixin.sleman.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.andia.mixin.model.EList;
import com.andia.mixin.sleman.api.SAssignment;

public class XObjectTest {

	@Test
	public void testSObject() {

		XText textJon = XTestUtil.createText("jon");
		XNumber age30 = XTestUtil.createNumber(30);

		XAssignment nameField = XTestUtil.createAssignment("name", textJon);
		XAssignment ageField = XTestUtil.createAssignment("age", age30);

		List<SAssignment> input = Arrays.asList(nameField, ageField);
		XObject object = new XObject();
		EList<XAssignment> fields = object.getFields();
		fields.add(nameField);
		fields.add(ageField);

		Collection<String> fieldNames = object.fieldNames();
		assertEquals(input.size(), fieldNames.size());
		assertTrue(fieldNames.contains("name"));
		assertTrue(fieldNames.contains("age"));

		assertEquals(textJon, object.getField("name"));
		assertEquals(age30, object.getField("age"));

		String literal = "{name: 'jon', age: 30}";
		assertEquals(literal, object.toLiteral());
		assertEquals(literal, object.toString());

	}
}
