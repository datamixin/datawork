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
package com.andia.mixin.webface.jaxrs;

import java.io.StringWriter;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.json.JsonWriter;

public class ExceptionSerializer {

	public static String PACKAGE_PREFIX = "com.andia";

	public final static String CLASS = "class";
	public final static String CAUSE = "cause";
	public final static String MESSAGE = "message";
	public final static String METHOD = "method";
	public final static String FILENAME = "filename";
	public final static String LINE = "line";
	public final static String STACKTRACE = "stackTrace";

	public ExceptionSerializer() {
	}

	public String serialize(Throwable e) {

		StringWriter stringWriter = new StringWriter();
		JsonWriter jsonWriter = Json.createWriter(stringWriter);
		JsonObjectBuilder builder = createBuilder(e);
		jsonWriter.write(builder.build());

		StringBuffer buffer = stringWriter.getBuffer();
		String string = buffer.toString();
		return string;
	}

	private JsonObjectBuilder createBuilder(Throwable e) {

		JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
		objectBuilder.add(CLASS, e.getClass().getName());
		String message = e.getMessage();
		if (message != null) {
			objectBuilder.add(MESSAGE, message);
		}

		JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
		StackTraceElement[] elements = e.getStackTrace();
		for (int i = 0; i < elements.length; i++) {
			StackTraceElement element = elements[i];
			JsonObjectBuilder traceBuilder = Json.createObjectBuilder();
			String className = element.getClassName();
			if (className.startsWith(PACKAGE_PREFIX)) {
				traceBuilder.add(CLASS, className);
				traceBuilder.add(METHOD, element.getMethodName());
				String filename = element.getFileName();
				if (filename != null) {
					traceBuilder.add(FILENAME, filename);
					traceBuilder.add(LINE, element.getLineNumber());
				}
				arrayBuilder.add(traceBuilder);
			}
		}

		objectBuilder.add(STACKTRACE, arrayBuilder);

		Throwable cause = e.getCause();
		if (cause != null) {
			JsonObjectBuilder causeBuilder = createBuilder(cause);
			objectBuilder.add(CAUSE, causeBuilder);
		}

		return objectBuilder;
	}

}
