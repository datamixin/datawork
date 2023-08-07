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

import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.andia.mixin.bekasi.Runserver;
import com.andia.mixin.bekasi.RunserverException;
import com.andia.mixin.bekasi.Runspace;
import com.andia.mixin.bekasi.resources.RunspaceItem;
import com.andia.mixin.bekasi.resources.RunspaceItemList;
import com.andia.mixin.lawang.SecuritySetting;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RestFileRunspace {

	public static final String ANCESTORS = "ancestors";
	public static final String LIST = "list";
	public static final String RENAME = "rename";
	public static final String NAMES = "names";
	public static final String MOVE = "move";
	public static final String COPY = "copy";
	public static final String CREATE_FILE = "create-file";
	public static final String CREATE_FOLDER = "create-folder";
	public static final String DEPENDENT_FILES = "dependent-files";

	protected Runserver runserver;
	protected Runspace runspace;

	@Inject
	public void setSecuritySetting(SecuritySetting setting) throws RunserverException {
		String space = setting.getUserId();
		runspace = runserver.getRunspace(space);
	}

	@GET
	@Path("/")
	public RunspaceItemList getHomeList() throws Exception {
		RunspaceItemList list = runspace.getHomeList();
		return list;
	}

	@GET
	@Path("{itemId}")
	public RunspaceItem getItem(@PathParam("itemId") String itemId) throws Exception {
		UUID uuid = UUID.fromString(itemId);
		if (runspace.isItemExists(uuid)) {
			RunspaceItem item = runspace.getItem(uuid);
			return item;
		} else {
			throw new Exception("Missing item " + itemId);
		}
	}

	@DELETE
	@Path("{itemId}")
	public void removeItem(@PathParam("itemId") String itemId) throws Exception {
		UUID uuid = UUID.fromString(itemId);
		runspace.deleteItem(uuid);
	}

	@GET
	@Path("{itemId}/" + ANCESTORS)
	public RunspaceItem[] getAncestors(@PathParam("itemId") String itemId) throws Exception {
		UUID uuid = UUID.fromString(itemId);
		RunspaceItem[] items = runspace.getItemAncestors(uuid);
		return items;
	}

	@GET
	@Path("{folderId}/" + LIST)
	public RunspaceItemList listItems(@PathParam("folderId") String folderId) throws Exception {
		UUID uuid = UUID.fromString(folderId);
		RunspaceItemList list = runspace.getItemList(uuid);
		return list;
	}

	@GET
	@Path("{folderId}/" + NAMES)
	public String[] getItemNameList(@PathParam("folderId") String folderId) throws Exception {
		UUID uuid = UUID.fromString(folderId);
		String[] names = runspace.getItemNames(uuid);
		return names;
	}

	@POST
	@Path("{itemId}/" + RENAME)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunspaceItem postItemRename(@PathParam("itemId") String itemId, @FormParam("newName") String newName)
			throws Exception {
		UUID uuid = UUID.fromString(itemId);
		RunspaceItem item = runspace.renameItem(uuid, newName);
		return item;
	}

	@POST
	@Path("{itemId}/" + MOVE)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunspaceItem postItemMove(@PathParam("itemId") String itemId, @FormParam("newFolderId") String newFolderId)
			throws Exception {
		UUID itemUUID = UUID.fromString(itemId);
		UUID newFolderUUID = UUID.fromString(newFolderId);
		RunspaceItem item = runspace.moveItem(itemUUID, newFolderUUID);
		return item;
	}

	@POST
	@Path("{itemId}/" + COPY)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunspaceItem postItemCopy(@PathParam("itemId") String itemId, @FormParam("newFolderId") String newFolderId,
			@FormParam("newName") String newName) throws Exception {
		UUID itemUUID = UUID.fromString(itemId);
		UUID newFolderUUID = UUID.fromString(newFolderId);
		RunspaceItem item = runspace.copyItem(itemUUID, newFolderUUID, newName);
		return item;
	}

	@POST
	@Path("{folderId}/" + CREATE_FOLDER)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunspaceItem postCreateFolder(@PathParam("folderId") String folderId, @FormParam("name") String name)
			throws Exception {
		UUID uuid = UUID.fromString(folderId);
		RunspaceItem item = runspace.createFolder(uuid, name);
		return item;
	}

	@POST
	@Path("{folderId}/" + CREATE_FILE)
	@Consumes(APPLICATION_FORM_URLENCODED)
	public RunspaceItem postCreateFile(@PathParam("folderId") String folderId, @FormParam("name") String name)
			throws Exception {
		UUID uuid = UUID.fromString(folderId);
		RunspaceItem item = runspace.createFile(uuid, name);
		return item;
	}

	@GET
	@Path("{fileId}/" + DEPENDENT_FILES)
	public UUID[] getDependentFiles(@PathParam("fileId") String fileId) throws Exception {
		UUID uuid = UUID.fromString(fileId);
		UUID[] fileIds = runspace.getDependentFiles(uuid);
		return fileIds;
	}

}
