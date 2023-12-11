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

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.Notification;
import com.andia.mixin.padang.model.XCell;
import com.andia.mixin.padang.model.XFacet;
import com.andia.mixin.padang.outset.CellOutset;

public class CellRegulator extends PartRegulator {

	@Override
	public XCell getModel() {
		return (XCell) super.getModel();
	}

	@Override
	public CellOutset getOutset() {
		return (CellOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XCell model = getModel();
		XFacet facet = model.getFacet();
		return new Object[] { facet };
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			EFeature feature = notification.getFeature();
			if (feature == XCell.FEATURE_FACET) {
				this.updateChildren();
			}
		}
	}

}
