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

import com.andia.mixin.model.EList;
import com.andia.mixin.model.Notification;
import com.andia.mixin.padang.model.XMutation;
import com.andia.mixin.padang.model.XOption;
import com.andia.mixin.padang.outset.MutationOutset;
import com.andia.mixin.rmo.EObjectRegulator;

public class MutationRegulator extends EObjectRegulator {

	@Override
	public XMutation getModel() {
		return (XMutation) super.getModel();
	}

	@Override
	public MutationOutset getOutset() {
		return (MutationOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XMutation model = getModel();
		EList<XOption> options = model.getOptions();
		return new Object[] { options };
	}

	@Override
	public void update() {
		super.update();
		this.updateOperation();
	}

	@Override
	public void notifyChanged(Notification notification) {

		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {

			this.updateChildren();

			Object feature = notification.getFeature();
			if (feature == XMutation.FEATURE_OPERATION) {
				updateOperation();
			}
		}
	}

	private void updateOperation() {
		XMutation model = getModel();
		String operation = model.getOperation();
		MutationOutset outset = getOutset();
		outset.setOperation(operation);
	}

}
