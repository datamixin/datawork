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
import com.andia.mixin.padang.model.XDataset;
import com.andia.mixin.padang.model.XDisplay;
import com.andia.mixin.padang.model.XSource;
import com.andia.mixin.padang.outset.DatasetOutset;
import com.andia.mixin.util.ArrayUtils;

public class DatasetRegulator extends ReceiptRegulator {

	@Override
	public XDataset getModel() {
		return (XDataset) super.getModel();
	}

	@Override
	public DatasetOutset getOutset() {
		return (DatasetOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XDataset model = getModel();
		XSource source = model.getSource();
		XDisplay display = model.getDisplay();
		Object[] children = super.getModelChildren();
		return ArrayUtils.push(children, new Object[] { source, display });
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			EFeature feature = notification.getFeature();
			if (feature == XDataset.FEATURE_SOURCE) {
				this.updateChildren();
			} else if (feature == XDataset.FEATURE_DISPLAY) {
				this.updateChildren();
			}
		}
	}

}
