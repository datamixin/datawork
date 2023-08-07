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
package com.andia.mixin.model;

public class Notification {

	// EObject and EMap
	public final static int SET = 1;
	public final static int UNSET = 2;

	// EList
	public final static int ADD = 3;
	public final static int REMOVE = 4;
	public final static int MOVE = 5;
	public final static int ADD_MANY = 6;
	public final static int REMOVE_MANY = 7;
	public final static int REPLACE_MANY = 8;

	private EObject notifier;
	private int eventType;
	private EFeature feature;
	private Object oldValue;
	private Object newValue;
	private int listPosition;
	private String mapKey;

	Notification(EObject notifier, int eventType,
			EFeature feature, Object oldValue, Object newValue, int listPosition, String mapKey) {

		this.notifier = notifier;
		this.eventType = eventType;
		this.feature = feature;
		this.oldValue = oldValue;
		this.newValue = newValue;
		this.listPosition = listPosition;
		this.mapKey = mapKey;
	}

	public EObject getNotifier() {
		return this.notifier;
	}

	public int getEventType() {
		return this.eventType;
	}

	public EFeature getFeature() {
		return this.feature;
	}

	public Object getOldValue() {
		return this.oldValue;
	}

	public Object getNewValue() {
		return this.newValue;
	}

	public int getListPosition() {
		return this.listPosition;
	}

	public String getMapKey() {
		return this.mapKey;
	}

}
