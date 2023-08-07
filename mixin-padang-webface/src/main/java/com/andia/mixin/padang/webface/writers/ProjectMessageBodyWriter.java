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
package com.andia.mixin.padang.webface.writers;

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.ext.Provider;

import com.andia.mixin.bekasi.webface.writers.EObjectMessageBodyWriter;
import com.andia.mixin.padang.model.PadangPackage;
import com.andia.mixin.padang.model.XProject;

@Provider
@Produces(MediaType.APPLICATION_JSON)
public class ProjectMessageBodyWriter extends EObjectMessageBodyWriter<XProject> {

	public ProjectMessageBodyWriter() {
		super(PadangPackage.eINSTANCE);
	}

}
