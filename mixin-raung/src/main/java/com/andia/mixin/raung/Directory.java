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
package com.andia.mixin.raung;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public final class Directory {

	private Repository repository;
	private UUID folderId;
	private String extension;

	public Directory(Repository repository, UUID folderId, String extension) {
		this.repository = repository;
		this.folderId = folderId;
		this.extension = extension;
		prepareExtension();
	}

	private void prepareExtension() {
		if (!extension.startsWith(".")) {
			extension = "." + extension;
		}
	}

	private RepositoryItem getItem(String name) {
		String fullname = getFullName(name);
		RepositoryItem item = repository.loadItem(folderId, fullname);
		return item;
	}

	private UUID getFileId(String name) throws RepositoryException {
		RepositoryItem item = getItem(name);
		if (item.isFile()) {
			return item.getId();
		}else {
			throw new RepositoryException("Missing file " + name);
		}
	}

	public String getFullName(String name) {
		return name + extension;
	}

	public String getFileContents(String name) throws RepositoryException {
		UUID fileId = getFileId(name);
		return repository.loadContent(fileId);
	}

	public void setFileContents(String name, String string) throws RepositoryException {
		UUID fileId = getFileId(name);
		repository.saveContent(fileId, string);
	}

	public boolean createNewFile(String name) throws RepositoryException {
		String fullname = getFullName(name);
		UUID id = repository.createFile(folderId, fullname);
		return id != null;
	}

	public boolean delete(String name) throws RepositoryException {
		UUID fileId = getFileId(name);
		return repository.deleteFile(fileId);
	}

	public boolean rename(String oldName, String newName) throws RepositoryException {
		UUID fileId = getFileId(oldName);
		String newFullname = getFullName(newName);
		return repository.renameItem(fileId, newFullname);
	}

	public boolean isExists(String name) {
		String fullname = getFullName(name);
		return repository.isItemExists(folderId, fullname);
	}

	public long getModified(String name) {
		RepositoryItem item = getItem(name);
		return item.getLastModified();
	}

	public Collection<String> listNames() {
		List<String> resources = new ArrayList<>();
		RepositoryItemList items = repository.loadItemList(folderId);
		for (RepositoryItem item : items.getItems()) {
			if (item.isFile()) {
				String name = item.getName();
				if (!name.endsWith(extension)) {
					continue;
				}
				int length = name.length();
				int end = length - extension.length();
				String nameOnly = name.substring(0, end);
				resources.add(nameOnly);
			}
		}
		return resources;
	}

}
