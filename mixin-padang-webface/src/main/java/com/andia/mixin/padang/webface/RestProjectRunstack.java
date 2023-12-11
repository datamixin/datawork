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
package com.andia.mixin.padang.webface;

import static javax.ws.rs.core.MediaType.APPLICATION_FORM_URLENCODED;

import java.util.UUID;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.andia.mixin.bekasi.webface.RestFileRunstack;
import com.andia.mixin.bekasi.webface.RestSystemWorkspace;
import com.andia.mixin.padang.ProjectRunserver;
import com.andia.mixin.padang.model.Padang;
import com.andia.mixin.padang.model.XProject;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.Modification;

@RequestScoped
@Path(RestProjectRunstack.PATH)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RestProjectRunstack extends RestFileRunstack {

	public static final String PATH = RestSystemWorkspace.PATH + "/" + Projects.PATH + "/runstack";

	@Inject
	@Named(Projects.PATH)
	public void setRunserver(ProjectRunserver runserver) {
		this.runserver = runserver;
	}

	@GET
	@Path("{fileId}/" + MODEL)
	public XProject getModel(@PathParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		XProject model = (XProject) runstack.getModel(uuid);
		return model;
	}

	@PUT
	@Path("{fileId}/" + MODEL)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public boolean putModel(@PathParam("fileId") String fileId, @FormParam("model") XProject model)
			throws Exception {
		UUID uuid = UUID.fromString(fileId);
		runstack.setModel(uuid, model);
		return true;
	}

	@POST
	@Path("{fileId}/" + MODIFICATION)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public boolean postModification(@PathParam("fileId") String fileId,
			@FormParam("modification") @Named(Padang.NAME) Modification modification) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		runstack.applyModification(uuid, modification);
		return true;
	}

	@POST
	@Path("{fileId}/" + CHECKUP_STATE)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public Object getCheckupState(@PathParam("fileId") String fileId,
			@FormParam("call") @Named(Padang.NAME) FeatureCall call) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		Object state = runstack.checkupState(uuid, call);
		return state;
	}

	@POST
	@Path("{fileId}/" + INSPECT_VALUE)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public Object getInspectValue(@PathParam("fileId") String fileId,
			@FormParam("call") @Named(Padang.NAME) FeatureCall call) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		Object value = runstack.inspectValue(uuid, call);
		return value;
	}

}
