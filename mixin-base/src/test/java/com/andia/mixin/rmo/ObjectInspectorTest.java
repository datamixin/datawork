/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. */
package com.andia.mixin.rmo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class ObjectInspectorTest {

	@Invoke("upper")
	public String getUpper(String value) {
		return value.toUpperCase();
	}

	@Invoke("join")
	public String getUpper(String[] values) {
		return String.join(" ", values);
	}

	@Invoke("error")
	public void doError() {
		throw new UnsupportedOperationException();
	}

	@Test
	public void testInspectStringArgument() throws InvokeIgniterException {
		InvokeIgniter inspector = new InvokeIgniter(this);
		Object inspect = inspector.ignite("upper", new Object[] { "test" });
		assertEquals("TEST", inspect);
	}

	@Test
	public void testInspectArrayArgument() throws InvokeIgniterException {
		InvokeIgniter inspector = new InvokeIgniter(this);
		Object inspect = inspector.ignite("join", new Object[] { new String[] { "Jon", "Andika" } });
		assertEquals("Jon Andika", inspect);
	}

	@Test
	public void testInspectFailInvokeMethod() {
		InvokeIgniter inspector = new InvokeIgniter(this);
		InvokeIgniterException exception = assertThrows(InvokeIgniterException.class, () -> {
			inspector.ignite("error", new Object[] {});
		});
		assertEquals("Fail invoke method with annotation @Invoke(error)", exception.getMessage());
	}

	@Test
	public void testInspectUnmatchArgument() {
		InvokeIgniter inspector = new InvokeIgniter(this);
		InvokeIgniterException exception = assertThrows(InvokeIgniterException.class, () -> {
			inspector.ignite("upper", new Object[] {});
		});
		assertEquals("Parameter length mismatch", exception.getMessage());
	}

	@Test
	public void testMissingInspector() {
		InvokeIgniter igniter = new InvokeIgniter(new String());
		InvokeIgniterException exception = assertThrows(InvokeIgniterException.class, () -> {
			igniter.ignite("other", new Object[] {});
		});
		String message = exception.getMessage();
		assertTrue(message.startsWith("Missing method annotated with @Invoke"));
	}
}
