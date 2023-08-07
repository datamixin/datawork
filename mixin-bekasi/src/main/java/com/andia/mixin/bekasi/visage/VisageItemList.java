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
package com.andia.mixin.bekasi.visage;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.andia.mixin.Lean;
import com.andia.mixin.value.MixinItem;
import com.andia.mixin.value.MixinItemList;

public class VisageItemList extends Lean {

	private String id;
	private List<VisageItem> entries = new ArrayList<>();

	public VisageItemList() {
		super(VisageItemList.class);
	}

	public VisageItemList(MixinItemList list) {
		this();
		this.id = list.getId();
		for (MixinItem entry : list.getEntries()) {
			addEntry(new VisageItem(entry));
		}
	}

	public void setId(String id) {
		this.id = id;
	}

	public Object getId() {
		return id;
	}

	public Collection<VisageItem> getEntries() {
		return entries;
	}

	public void addEntry(VisageItem entry) {
		entries.add(entry);
	}

}
