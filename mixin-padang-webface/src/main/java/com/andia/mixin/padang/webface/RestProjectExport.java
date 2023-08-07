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
package com.andia.mixin.padang.webface;

import static javax.ws.rs.core.MediaType.APPLICATION_FORM_URLENCODED;

import java.io.IOException;
import java.io.OutputStream;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import com.andia.mixin.bekasi.visage.VisageObject;
import com.andia.mixin.bekasi.visage.VisageText;
import com.andia.mixin.bekasi.webface.RestFileExport;
import com.andia.mixin.bekasi.webface.RestSystemWorkspace;
import com.andia.mixin.padang.ProjectRunserver;
import com.andia.mixin.padang.model.Padang;
import com.andia.mixin.rmo.FeatureCall;

@RequestScoped
@Path(RestProjectExport.PATH)
public class RestProjectExport extends RestFileExport {

	public static final String PATH = RestSystemWorkspace.PATH + "/" + Projects.PATH + "/exports";
	public static final String FORMATS = "formats";
	public static final String DOWNLOAD = "download";

	@Inject
	@Named(Projects.PATH)
	public void setRunserver(ProjectRunserver runserver) {
		this.runserver = runserver;
	}

	@POST
	@Path("{fileId}/" + FORMATS)
	public Map<String, String> postFormats(@PathParam("fileId") String fileId,
			@FormParam("call") @Named(Padang.NAME) FeatureCall call) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		VisageObject object = (VisageObject) runstack.inspectValue(uuid, call);
		Map<String, String> formats = new LinkedHashMap<>();
		for (String format : object.fieldNames()) {
			VisageText text = (VisageText) object.get(format);
			String extension = text.getValue();
			formats.put(format, extension);
		}
		return formats;
	}

	@POST
	@Path("{fileId}/" + DOWNLOAD)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public Response postDownload(@PathParam("fileId") String fileId,
			@FormParam("call") @Named(Padang.NAME) FeatureCall call) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		Object value = runstack.inspectValue(uuid, call);
		ObjectStreamingOutput output = new ObjectStreamingOutput(value);
		return Response.ok(output).build();
	}

	public static class ObjectStreamingOutput implements StreamingOutput {

		private Object value;

		public ObjectStreamingOutput(Object value) {
			this.value = value;
		}

		@Override
		public void write(OutputStream output) throws IOException, WebApplicationException {
			if (value instanceof VisageText) {
				VisageText text = (VisageText) value;
				String value = text.getValue();
				byte[] bytes = value.getBytes();
				output.write(bytes);
			}
			output.flush();
		}
	}
}
