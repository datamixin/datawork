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
package com.andia.mixin.rmo;

import com.andia.mixin.model.Adapter;
import com.andia.mixin.model.AdapterList;
import com.andia.mixin.model.Notification;

abstract class AdapterRegulator extends Regulator implements Adapter {

	private Adapter[] customAdapters = new Adapter[0];

	public void activate() {
		super.activate();
		AdapterList adapters = this.getAdapters();
		adapters.add(this);

		// Tambah custom adapters
		customAdapters = getCustomAdapters();
		for (int i = 0; i < customAdapters.length; i++) {
			Adapter adapter = customAdapters[i];
			adapters.add(adapter);
		}

	}

	public void deactivate() {
		super.deactivate();

		AdapterList adapters = this.getAdapters();
		adapters.remove(this);

		// Hapus custom adapters
		for (int i = 0; i < this.customAdapters.length; i++) {
			Adapter adapter = this.customAdapters[i];
			adapters.remove(adapter);
		}
	}

	protected Adapter[] getCustomAdapters() {
		return new Adapter[0];
	}

	abstract protected AdapterList getAdapters();

	public void notifyChanged(Notification notification) {

	}

}
