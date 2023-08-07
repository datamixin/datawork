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
package com.andia.mixin.bekasi.visage;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class VisageErrorTest {

	@Test
	public void testWithMessage() {
		String message = "message";
		VisageError error = new VisageError(message);
		assertEquals(message, error.getMessage());
		assertEquals("VisageError(" + message + ")", error.toString());
	}

	@Test
	public void testWithException() {

		String message = "message";
		Exception exception = new Exception(message);
		VisageError error = new VisageError();
		error.init(exception);
		assertEquals(message, error.getMessage());

		String stackTrace = error.getStackTrace();
		assertTrue(stackTrace.startsWith("java.lang.Exception"));
	}

	@Test
	public void testWithExceptionNullMessage() {

		Exception exception = new Exception();
		VisageError error = new VisageError();
		error.init(exception);
		assertEquals("Exception", error.getMessage());

	}
}
