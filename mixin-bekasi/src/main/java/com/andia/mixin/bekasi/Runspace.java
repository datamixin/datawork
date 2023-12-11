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
package com.andia.mixin.bekasi;

import java.util.UUID;

import com.andia.mixin.bekasi.resources.RunspaceHomeList;
import com.andia.mixin.bekasi.resources.RunspaceItem;
import com.andia.mixin.bekasi.resources.RunspaceItemList;

public interface Runspace {

	public final static String PATH_DELIMITER = "/";

	public RunspaceHomeList getHomeList();

	public RunspaceItemList getItemList(UUID folderId);

	public RunspaceItem renameItem(UUID itemId, String newName);

	public RunspaceItem createFile(UUID folderId, String name) throws RunspaceException;

	public RunspaceItem createFolder(UUID folderId, String name) throws RunspaceException;

	public RunspaceItem moveItem(UUID itemId, UUID folderId);

	public RunspaceItem copyItem(UUID itemId, UUID folderId, String newName) throws RunspaceException;

	public boolean isItemExists(UUID itemId);

	public String[] getItemNames(UUID folderId);

	public RunspaceItem getItem(UUID itemId);

	public RunspaceItem[] getItemAncestors(UUID itemId);

	public String getFullPath(UUID itemId);

	public void deleteItem(UUID itemId);

	public boolean confirmDelete(UUID itemId);

	public UUID[] getDependentFiles(UUID fileId) throws RunspaceException;

}
