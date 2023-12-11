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
package com.andia.mixin.bekasi.resources;

import java.util.UUID;

import com.andia.mixin.Lean;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.raung.RepositoryItemList;

public class RunspaceItemList extends Lean {

	private UUID id;
	private String[] names = {};
	private RunspaceItem[] items = {};

	public RunspaceItemList() {
		super(RunspaceItemList.class);
	}

	public RunspaceItemList(Class<?> subClass) {
		super(subClass);
	}

	public RunspaceItemList(Class<?> subClass, Repository repository, UUID folderId) {
		super(subClass);
		this.id = folderId;
		readNameItems(repository, folderId);
	}

	public RunspaceItemList(Repository repository, UUID folderId) {
		this(RunspaceItemList.class, repository, folderId);
	}

	private void readNameItems(Repository repository, UUID folderId) {
		RepositoryItemList list = repository.loadItemList(folderId);
		RepositoryItem[] items = list.getItems();
		this.names = new String[items.length];
		this.items = new RunspaceItem[items.length];
		int counter = 0;
		for (RepositoryItem item : items) {
			UUID id = item.getId();
			this.names[counter] = item.getName();
			this.items[counter] = new RunspaceItem(repository, id);
			counter++;
		}
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public UUID getId() {
		return id;
	}

	public String[] getNames() {
		return names;
	}

	public RunspaceItem[] getItems() {
		return items;
	}

}
