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

import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path(RestExtensionRegistry.PATH)
@Produces(MediaType.APPLICATION_JSON)
public class RestExtensionRegistry {

	public final static String PATH = "/extensions";

	@GET
	@Path("scripts")
	public Map<String, String> getScripts() throws Exception {
		ExtensionRegistry registry = ExtensionRegistry.getInstance();
		return registry.getScripts();
	}

	@GET
	@Path("styles")
	public Map<String, String> getStyles() throws Exception {
		ExtensionRegistry registry = ExtensionRegistry.getInstance();
		return registry.getStyles();
	}

}
