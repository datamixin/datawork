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

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.Path;

import com.andia.mixin.bekasi.webface.RestFileRunspace;
import com.andia.mixin.bekasi.webface.RestSystemWorkspace;
import com.andia.mixin.padang.ProjectRunserver;

@RequestScoped
@Path(RestProjectRunspace.PATH)
public class RestProjectRunspace extends RestFileRunspace {

	public final static String PATH = RestSystemWorkspace.PATH + "/" + Projects.PATH + "/runspace";

	@Inject
	@Named(Projects.PATH)
	public void setRunserver(ProjectRunserver runserver) {
		this.runserver = runserver;
	}

}
