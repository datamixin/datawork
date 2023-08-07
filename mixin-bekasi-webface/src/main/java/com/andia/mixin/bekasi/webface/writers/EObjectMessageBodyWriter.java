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
package com.andia.mixin.bekasi.webface.writers;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;

import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EObjectSerde;
import com.andia.mixin.model.EObjectSerdeException;
import com.andia.mixin.model.EPackage;

public class EObjectMessageBodyWriter<M extends EObject> implements MessageBodyWriter<M> {

	private final EObjectSerde<EObject> serde;

	public EObjectMessageBodyWriter(EPackage packages) {
		serde = new EObjectSerde<>(packages);
	}

	@Override
	public long getSize(M model, Class<?> type, Type genericType,
			Annotation[] annotations, MediaType mediaType) {
		return -1;
	}

	@Override
	public boolean isWriteable(Class<?> type, Type genericType,
			Annotation[] annotations, MediaType mediaType) {
		return true;
	}

	@Override
	public void writeTo(M model, Class<?> type, Type genericType,
			Annotation[] annotations, MediaType mediaType,
			MultivaluedMap<String, Object> httpHeaders,
			OutputStream entityStream) throws IOException,
			WebApplicationException {
		PrintWriter printWriter = new PrintWriter(entityStream);
		try {
			String string = serde.serialize(model);
			printWriter.write(string);
			printWriter.flush();
		} catch (EObjectSerdeException e) {
			throw new WebApplicationException("Fail write model", e);
		} finally {
			printWriter.close();
		}
	}

}
