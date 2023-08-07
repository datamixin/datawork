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

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.andia.mixin.bekasi.webface.RestFileRunextra;
import com.andia.mixin.bekasi.webface.RestSystemWorkspace;
import com.andia.mixin.padang.ProjectRunserver;
import com.andia.mixin.padang.model.XMutation;

@RequestScoped
@Path(RestProjectRunextra.PATH)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RestProjectRunextra extends RestFileRunextra {

	public static final String PATH = RestSystemWorkspace.PATH + "/" + Projects.PATH + "/runextra";

	@Inject
	@Named(Projects.PATH)
	public void setRunserver(ProjectRunserver runserver) {
		this.runserver = runserver;
	}

	@GET
	@Path("{group}/{name}")
	public XMutation get(@PathParam("group") String group, @PathParam("name") String name) throws Exception {
		return (XMutation) runextra.loadModel(group, name);
	}

	@PUT
	@Path("{group}/{name}")
	@Consumes(APPLICATION_FORM_URLENCODED)
	public void put(@PathParam("group") String group,
			@PathParam("name") String name, @FormParam("model") XMutation model) throws Exception {
		runextra.saveModel(group, name, model);
	}

}
