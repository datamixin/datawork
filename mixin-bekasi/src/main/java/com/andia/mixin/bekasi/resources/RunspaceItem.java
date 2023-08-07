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
package com.andia.mixin.bekasi.resources;

import java.util.UUID;

import com.andia.mixin.Lean;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.raung.RepositoryItemList;

public class RunspaceItem extends Lean {

	private UUID id;
	private String name;
	private String nameOnly;
	private String extension;
	private UUID parentId;
	private long modified = 0;
	private int itemCount = 0;
	private boolean file = true;
	private boolean directory = false;

	public RunspaceItem() {
		super(RunspaceItem.class);
	}

	public RunspaceItem(Repository repository, UUID itemId) {
		super(RunspaceItem.class);
		this.id = itemId;
		RepositoryItem item = repository.loadItem(itemId);
		this.name = item.getName();
		int dotIndex = name.lastIndexOf('.');
		this.nameOnly = name.substring(0, dotIndex == -1 ? name.length() : dotIndex);
		this.extension = name.substring(dotIndex == -1 ? name.length() : dotIndex + 1);
		this.parentId = item.getParentId();
		this.modified = item.getLastModified();
		this.readItemCount(repository, item);
		this.file = item.isFile();
		this.directory = item.isFolder();
	}

	private void readItemCount(Repository repository, RepositoryItem item) {
		if (item.isFolder()) {
			UUID folderId = item.getId();
			RepositoryItemList list = repository.loadItemList(folderId);
			String[] names = list.getItemNames();
			this.itemCount = names.length;
		}
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public UUID getId() {
		return id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public UUID getParentId() {
		return parentId;
	}

	public void setNameOnly(String nameOnly) {
		this.nameOnly = nameOnly;
	}

	public String getNameOnly() {
		return nameOnly;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	public String getExtension() {
		return extension;
	}

	public void setFile(boolean file) {
		this.file = file;
	}

	public boolean isFile() {
		return file;
	}

	public void setDirectory(boolean directory) {
		this.directory = directory;
	}

	public boolean isDirectory() {
		return directory;
	}

	public void setItemCount(int itemCount) {
		this.itemCount = itemCount;
	}

	public int getItemCount() {
		return itemCount;
	}

	public void setModified(long modified) {
		this.modified = modified;
	}

	public long getModified() {
		return modified;
	}

	@Override
	public String toString() {
		return name;
	}
}
