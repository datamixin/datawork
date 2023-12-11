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
package com.andia.mixin.bekasi.webface;

import static javax.ws.rs.core.MediaType.APPLICATION_FORM_URLENCODED;

import java.io.StringWriter;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonString;
import javax.json.JsonWriter;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.andia.mixin.Encryption;
import com.andia.mixin.bekasi.RunserverException;
import com.andia.mixin.lawang.SecuritySetting;
import com.andia.mixin.pariaman.Preference;

@RequestScoped
@Path(RestSystemWorkspace.PATH)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RestSystemWorkspace {

	public final static String PATH = "/workspace";

	private Preference preference;
	private Encryption encryption;

	private String space;

	@Inject
	public void setPreference(Preference preference) {
		this.preference = preference;
	}

	@Inject
	public void setEncryption(Encryption encryption) {
		this.encryption = encryption;
	}

	@Inject
	public void setSecuritySetting(SecuritySetting setting) throws RunserverException {
		this.space = setting.getUserId();
	}

	@GET
	@Path("properties/{key}")
	public String getProperty(@PathParam("key") String key) throws Exception {
		if (key != null) {
			if (key.startsWith("workspace.")) {
				return getSystemProperty(key);
			}
		}
		return null;
	}

	private String getSystemProperty(String key) {
		String property = System.getProperty(key);
		if (property == null) {
			return "null";
		} else {
			JsonString string = Json.createValue(property);
			StringWriter writer = new StringWriter();
			JsonWriter jsonWriter = Json.createWriter(writer);
			jsonWriter.write(string);
			String result = writer.toString();
			return result;
		}
	}

	@GET
	@Path("preferences/{key}")
	public String getPreference(@PathParam("key") String key) throws Exception {
		String setting = preference.getSetting(space, key);
		return setting;
	}

	@PUT
	@Path("preferences/{key}")
	@Consumes(APPLICATION_FORM_URLENCODED)
	public void setPreference(@PathParam("key") String key, @FormParam("value") String value) throws Exception {
		preference.setSetting(space, key, value);
	}

	@GET
	@Path("encryption/encrypt")
	public String getEncrypt(@QueryParam("text") String text) throws Exception {
		return encryption.encrypt(text);
	}

	@GET
	@Path("encryption/decrypt")
	public String getDecrypt(@QueryParam("text") String text) throws Exception {
		return encryption.decrypt(text);
	}

}
