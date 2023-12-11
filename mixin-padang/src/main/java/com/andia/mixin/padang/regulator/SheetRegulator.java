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
package com.andia.mixin.padang.regulator;

import com.andia.mixin.model.Notification;
import com.andia.mixin.padang.model.XForesee;
import com.andia.mixin.padang.model.XSheet;
import com.andia.mixin.padang.outset.SheetOutset;
import com.andia.mixin.rmo.EObjectRegulator;

public class SheetRegulator extends EObjectRegulator {

	@Override
	public XSheet getModel() {
		return (XSheet) super.getModel();
	}

	@Override
	public SheetOutset getOutset() {
		return (SheetOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XSheet model = getModel();
		XForesee foresee = model.getForesee();
		return new Object[] { foresee };
	}

	@Override
	public void update() {
		updateName();
		super.update();
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			Object feature = notification.getFeature();
			if (feature == XSheet.FEATURE_NAME) {
				updateName();
			} else if (feature == XSheet.FEATURE_FORESEE) {
				updateChildren();
			}
		}
	}

	private void updateName() {
		XSheet model = getModel();
		String name = model.getName();
		SheetOutset outset = getOutset();
		outset.setName(name);
	}

}
