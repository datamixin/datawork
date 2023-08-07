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
package com.andia.mixin.bekasi.webface;

import java.util.Collection;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.andia.mixin.bekasi.Runextra;
import com.andia.mixin.bekasi.Runserver;
import com.andia.mixin.bekasi.RunserverException;
import com.andia.mixin.lawang.SecuritySetting;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RestFileRunextra {

	protected Runserver runserver;
	protected Runextra runextra;

	@Inject
	public void setRunserver(Runserver runserver) {
		this.runserver = runserver;
	}

	@Inject
	public void setSecuritySetting(SecuritySetting setting) throws RunserverException {
		String space = setting.getUserId();
		runextra = runserver.getRunextra(space);
	}

	@GET
	@Path("{group}")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<String> getNames(@PathParam("group") String group, @QueryParam("type") String type)
			throws Exception {
		if (type == null) {
			return runextra.getNames(group);
		} else {
			return runextra.getNamesByType(group, type);
		}
	}

	@DELETE
	@Path("{group}/{name}")
	public void remove(@PathParam("group") String group, @PathParam("name") String name) throws Exception {
		runextra.removeModel(group, name);
	}

}
