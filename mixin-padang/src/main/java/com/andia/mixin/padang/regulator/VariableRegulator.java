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
import com.andia.mixin.padang.model.XPreparation;
import com.andia.mixin.padang.model.XVariable;
import com.andia.mixin.padang.outset.OptionOutset;
import com.andia.mixin.padang.outset.VariableOutset;
import com.andia.mixin.rmo.Acceptor;
import com.andia.mixin.rmo.EObjectRegulator;
import com.andia.mixin.rmo.FeatureKey;
import com.andia.mixin.rmo.FeaturePath;
import com.andia.mixin.rmo.FeaturePathUtils;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.rmo.Rectification;

public class VariableRegulator extends EObjectRegulator {

	@Override
	public XVariable getModel() {
		return (XVariable) super.getModel();
	}

	@Override
	public VariableOutset getOutset() {
		return (VariableOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XVariable model = getModel();
		XPreparation preparation = model.getPreparation();
		return new Object[] { preparation };
	}

	@Override
	public void update() {
		super.update();
		updateName();
		updateFormula();
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			Object feature = notification.getFeature();
			if (feature == XVariable.FEATURE_NAME) {
				updateName();
			} else if (feature == XVariable.FEATURE_FORMULA) {
				updateFormula();
			} else if (feature == XVariable.FEATURE_PREPARATION) {
				this.updateChildren();
			}
		}
	}

	private void updateName() {
		XVariable model = getModel();
		String name = model.getName();
		VariableOutset outset = getOutset();
		outset.setName(name);
	}

	private void updateFormula() {
		XVariable model = getModel();
		String formula = model.getFormula();
		VariableOutset outset = getOutset();
		outset.setFormula(formula);
	}

	@Override
	protected void createAcceptors() {
		super.installRectificationAcceptors(OptionOutset.FORMULA, new FormulaRectificationAcceptor());
	}

	class FormulaRectificationAcceptor implements Acceptor {

		public void accept(Rectification rectification, List<Modification> ratifications) {

			// Model
			String formula = (String) rectification.getData(OptionOutset.FORMULA);
			XVariable model = getModel();

			// Modification
			String name = XVariable.FEATURE_FORMULA.getName();
			FeatureKey key = new FeatureKey(name);
			FeaturePath path = FeaturePathUtils.fromModel(model, key);
			Modification modification = new Modification(path, Notification.SET);
			modification.setNewValue(formula);
			ratifications.add(modification);
		}

	}

}
