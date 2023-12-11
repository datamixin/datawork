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
package com.andia.mixin.raung.jdbc;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.raung.RepositoryItemList;

public class JdbcRepositoryItemList implements RepositoryItemList {

	private Set<RepositoryItem> items = new TreeSet<>();

	public JdbcRepositoryItemList(RepositoryTable table, UUID parentId) {
		Collection<RepositoryRecord> records = table.selectRecordsByParentId(parentId);
		for (RepositoryRecord record : records) {
			RepositoryItem item = new JdbcRepositoryItem(record);
			items.add(item);
		}
	}

	@Override
	public RepositoryItem[] getItems() {
		return items.toArray(new RepositoryItem[0]);
	}

	@Override
	public String[] getItemNames() {
		Collection<String> names = new ArrayList<>();
		for (RepositoryItem item : items) {
			String name = item.getName();
			names.add(name);
		}
		return names.toArray(new String[0]);
	}

}
