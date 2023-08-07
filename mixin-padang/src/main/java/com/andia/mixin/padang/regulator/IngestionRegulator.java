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
import com.andia.mixin.padang.model.XIngestion;
import com.andia.mixin.padang.outset.IngestionOutset;

public class IngestionRegulator extends SourceRegulator {

	@Override
	public XIngestion getModel() {
		return (XIngestion) super.getModel();
	}

	@Override
	public IngestionOutset getOutset() {
		return (IngestionOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		return new Object[] {};
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			EFeature feature = notification.getFeature();
			if (feature == XIngestion.FEATURE_ORIGIN) {
				this.updateChildren();
			}
		}
	}

}
