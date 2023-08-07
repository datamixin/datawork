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
package com.andia.mixin.base;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import com.andia.mixin.value.MixinItem;
import com.andia.mixin.value.MixinItemList;

public class BaseEntryList implements MixinItemList {

	private String id;
	private List<MixinItem> entries = new ArrayList<>();

	public BaseEntryList(String id) {
		this.id = id;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public Collection<MixinItem> getEntries() {
		entries.sort(new MixinEntryComparator());
		return entries;
	}

	public void add(MixinItem entry) {
		entries.add(entry);
	}

	class MixinEntryComparator implements Comparator<MixinItem> {

		@Override
		public int compare(MixinItem entry, MixinItem other) {
			if (entry.isGroup()) {
				if (!other.isGroup()) {
					return -1;
				}
			} else {
				if (other.isGroup()) {
					return 1;
				}
			}
			String entryName = entry.getName().toLowerCase();
			String otherName = other.getName().toLowerCase();
			return entryName.compareTo(otherName);
		}

	}

}
