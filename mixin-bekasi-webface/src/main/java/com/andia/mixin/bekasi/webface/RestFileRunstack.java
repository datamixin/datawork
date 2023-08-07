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

import static javax.ws.rs.core.MediaType.APPLICATION_FORM_URLENCODED;

import java.util.Collection;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.andia.mixin.bekasi.Runserver;
import com.andia.mixin.bekasi.RunserverException;
import com.andia.mixin.bekasi.Runstack;
import com.andia.mixin.bekasi.resources.RunstackFile;
import com.andia.mixin.lawang.SecuritySetting;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RestFileRunstack {

	public static final String LIST_UNTITLES = "list-untitles";
	public static final String CREATE_UNTITLED = "create-untitled";
	public static final String CANCEL_UNTITLED = "cancel-untitled";
	public static final String OPEN = "open";
	public static final String SAVE = "save";
	public static final String CLOSE = "close";
	public static final String SAVE_AS = "save-as";
	public static final String REVERT = "revert";
	public static final String MODEL = "model";
	public static final String MODIFICATION = "modification";
	public static final String CHECKUP_STATE = "checkup-state";
	public static final String INSPECT_VALUE = "inspect-value";
	public static final String POINTER_LIST = "pointer-list";

	protected Runserver runserver;
	protected Runstack runstack;

	@Inject
	public void setSecuritySetting(SecuritySetting setting) throws RunserverException {
		String space = setting.getUserId();
		runstack = runserver.getRunstack(space);
	}

	@GET
	@Path("/")
	public Collection<RunstackFile> getOpenedList() throws Exception {
		Collection<RunstackFile> files = runstack.getOpenedList();
		return files;
	}

	@GET
	@Path("{fileId}")
	public RunstackFile getFile(@PathParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		RunstackFile file = runstack.getFile(uuid);
		return file;
	}

	@GET
	@Path(LIST_UNTITLES)
	public String[] getUntitledNameList() throws Exception {
		String[] names = runstack.getUntitledNameList();
		return names;
	}

	@POST
	@Path(CREATE_UNTITLED)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunstackFile postCreateUntitled(@FormParam("name") String name) throws Exception {
		RunstackFile file = runstack.createUntitled(name);
		return file;
	}

	@POST
	@Path(CANCEL_UNTITLED)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public boolean postCancelUntitled(@FormParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		return runstack.cancelUntitled(uuid);
	}

	@POST
	@Path("{fileId}/" + OPEN)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunstackFile postFileOpen(@PathParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		return runstack.openFile(uuid);
	}

	@POST
	@Path("{fileId}/" + CLOSE)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public boolean postFileClose(@PathParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		return runstack.closeFile(uuid);
	}

	@POST
	@Path("{fileId}/" + SAVE)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunstackFile postFileSave(@PathParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		RunstackFile file = runstack.saveFile(uuid);
		return file;
	}

	@POST
	@Path("{fileId}/" + SAVE_AS)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunstackFile postFileSaveAs(@PathParam("fileId") String fileId,
			@FormParam("folderId") String folderId, @FormParam("newName") String newName) throws Exception {
		UUID fileUUID = UUID.fromString(fileId);
		UUID folderUUID = UUID.fromString(folderId);
		RunstackFile file = runstack.saveFileAs(fileUUID, folderUUID, newName);
		return file;
	}

	@POST
	@Path("{fileId}/" + REVERT)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunstackFile postFileRevert(@PathParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		RunstackFile file = runstack.revertFile(uuid);
		return file;
	}

}
