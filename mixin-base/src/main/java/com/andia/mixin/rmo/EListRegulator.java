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

import com.andia.mixin.model.AdapterList;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.Notification;

public class EListRegulator extends AdapterRegulator {

	public EList<?> getModel() {
		return (EList<?>) super.getModel();
	}

	@Override
	protected OutsetList<?> createOutset() {
		return getOutset();
	}

	public <T extends Outset> void setOutset(OutsetList<T> list) {
		super.setOutset(list);
	}

	@Override
	protected AdapterList getAdapters() {
		EList<?> model = this.getModel();
		EObject owner = model.eOwner();
		AdapterList eAdapters = owner.eAdapters();
		return eAdapters;
	}

	@Override
	public String getQualifiedPath() {
		FeaturePath path = getFeaturePath();
		return path.toString();
	}

	private FeaturePath getFeaturePath() {
		EList<?> model = this.getModel();
		EFeature feature = model.eFeature();
		EObject owner = model.eOwner();
		String name = feature.getName();
		FeatureKey key = new FeatureKey(name);
		FeaturePath path = FeaturePathUtils.fromModel(owner, key);
		return path;
	}

	@Override
	public FeatureKey[] getFeatureKeys() {
		FeaturePath path = getFeaturePath();
		return path.getKeys();
	}

	public Object[] getModelChildren() {
		EList<?> model = this.getModel();
		return model.toArray();
	}

	public void notifyChanged(Notification notification) {

		EFeature notifFeature = notification.getFeature();
		EList<?> model = getModel();
		EFeature feature = model.eFeature();

		if (notifFeature == feature) {
			int eventType = notification.getEventType();
			if (eventType == Notification.ADD
					|| eventType == Notification.REMOVE
					|| eventType == Notification.MOVE
					|| eventType == Notification.SET
					|| eventType == Notification.ADD_MANY
					|| eventType == Notification.REMOVE_MANY
					|| eventType == Notification.REPLACE_MANY) {
				update();
			}
		}
	}

	@Override
	public OutsetList<?> getOutset() {
		return (OutsetList<?>) super.getOutset();
	}

	@Override
	@SuppressWarnings("unchecked")
	protected void addChildOutset(Regulator child, int index) {
		super.addChildOutset(child, index);
		Outset outset = child.getOutset();
		OutsetList<Outset> list = (OutsetList<Outset>) getOutset();
		list.add(outset, index);
	}

	@Override
	@SuppressWarnings("unchecked")
	protected void moveChildOutset(Regulator child, int index) {
		Outset outset = child.getOutset();
		OutsetList<Outset> list = (OutsetList<Outset>) getOutset();
		list.move(outset, index);
	}

	@Override
	@SuppressWarnings("unchecked")
	protected void removeChildOutset(Regulator child) {
		Outset outset = child.getOutset();
		OutsetList<Outset> list = (OutsetList<Outset>) getOutset();
		list.remove(outset);
		super.removeChildOutset(child);
	}

}
