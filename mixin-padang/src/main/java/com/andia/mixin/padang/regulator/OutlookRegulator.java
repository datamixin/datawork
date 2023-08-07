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
package com.andia.mixin.padang.regulator;

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.Notification;
import com.andia.mixin.padang.model.XOutlook;
import com.andia.mixin.padang.model.XViewset;
import com.andia.mixin.padang.outset.OutlookOutset;

public class OutlookRegulator extends ForeseeRegulator {

	@Override
	public XOutlook getModel() {
		return (XOutlook) super.getModel();
	}

	@Override
	public OutlookOutset getOutset() {
		return (OutlookOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XOutlook model = getModel();
		XViewset viewset = model.getViewset();
		return new Object[] { viewset };
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			EFeature feature = notification.getFeature();
			if (feature == XOutlook.FEATURE_VIEWSET) {
				this.updateChildren();
			}
		}
	}

}
