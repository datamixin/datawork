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

import com.andia.mixin.Lean;
import com.andia.mixin.bekasi.visage.VisageItem;
import com.andia.mixin.value.MixinItem;

public class VisageItem extends Lean {

	private String id;
	private String name;
	private String parentId;
	private int entryCount = 0;
	private boolean group = false;

	public VisageItem() {
		super(VisageItem.class);
	}

	public VisageItem(MixinItem entry) {
		super(VisageItem.class);
		this.id = entry.getId();
		this.name = entry.getName();
		this.parentId = entry.getParentId();
		this.entryCount = entry.getEntryCount();
		this.group = entry.isGroup();
	}

	public void setId(String id) {
		this.id = id;
	}

	public Object getId() {
		return id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public Object getParentId() {
		return parentId;
	}

	public void setGroup(boolean group) {
		this.group = group;
	}

	public boolean isGroup() {
		return group;
	}

	public void setEntryCount(int entryCount) {
		this.entryCount = entryCount;
	}

	public int getItemCount() {
		return entryCount;
	}

	@Override
	public String toString() {
		return name;
	}
}
