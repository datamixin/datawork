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

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class JsonExceptionMapper implements ExceptionMapper<Exception> {

	@Override
	@Produces({ MediaType.APPLICATION_JSON })
	public Response toResponse(Exception e) {
		ExceptionSerializer serializer = new ExceptionSerializer();
		String string = serializer.serialize(e);
		ResponseBuilder status = Response.status(Status.INTERNAL_SERVER_ERROR);
		ResponseBuilder entity = status.entity(string);
		ResponseBuilder type = entity.type(MediaType.APPLICATION_JSON);
		return type.build();
	}
}
