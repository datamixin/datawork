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

import org.junit.jupiter.api.Test;

public class XMemberTest {

	@Test
	public void testMember() {

		XPointer object = XTestUtil.createReference("object");
		XReference property = XTestUtil.createReference("property");
		XMember member = new XMember();
		member.setObject(object);
		member.setProperty(property);
		assertEquals(object, member.getObject());
		assertEquals(property, member.getProperty());

		String literal = "object.property";
		assertEquals(literal, member.toLiteral());
		assertEquals(literal, member.toString());

	}

}
