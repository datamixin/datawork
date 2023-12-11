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

import java.util.List;

import com.andia.mixin.model.Notification;
import com.andia.mixin.padang.model.XInput;
import com.andia.mixin.padang.outset.InputOutset;
import com.andia.mixin.rmo.Acceptor;
import com.andia.mixin.rmo.EObjectRegulator;
import com.andia.mixin.rmo.FeatureKey;
import com.andia.mixin.rmo.FeaturePath;
import com.andia.mixin.rmo.FeaturePathUtils;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.rmo.Rectification;

public class InputRegulator extends EObjectRegulator {

	@Override
	public XInput getModel() {
		return (XInput) super.getModel();
	}

	@Override
	public InputOutset getOutset() {
		return (InputOutset) super.getOutset();
	}

	@Override
	public void update() {
		super.update();
		updateName();
		updateValue();
	}

	@Override
	public void notifyChanged(Notification notification) {

		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			Object feature = notification.getFeature();
			if (feature == XInput.FEATURE_NAME) {
				updateName();
			} else if (feature == XInput.FEATURE_VALUE) {
				updateValue();
			}
		}
	}

	private void updateName() {
		XInput model = getModel();
		String name = model.getName();
		InputOutset outset = getOutset();
		outset.setName(name);
	}

	private void updateValue() {
		XInput model = getModel();
		String formula = model.getValue();
		InputOutset outset = getOutset();
		outset.setValue(formula);
	}

	@Override
	protected void createAcceptors() {
		super.installRectificationAcceptors(InputOutset.VALUE, new ValueRectificationAcceptor());
	}

	class ValueRectificationAcceptor implements Acceptor {

		public void accept(Rectification rectification, List<Modification> ratifications) {

			// Model
			String formula = (String) rectification.getData(InputOutset.VALUE);
			XInput model = getModel();

			// Modification
			String name = XInput.FEATURE_VALUE.getName();
			FeatureKey key = new FeatureKey(name);
			FeaturePath path = FeaturePathUtils.fromModel(model, key);
			Modification modification = new Modification(path, Notification.SET);
			modification.setNewValue(formula);
			ratifications.add(modification);
		}

	}

}
