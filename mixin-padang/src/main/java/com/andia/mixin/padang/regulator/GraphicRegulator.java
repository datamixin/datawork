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
import com.andia.mixin.padang.model.XGraphic;
import com.andia.mixin.padang.model.XVariable;
import com.andia.mixin.padang.outset.GraphicOutset;
import com.andia.mixin.rmo.EObjectRegulator;
import com.andia.mixin.util.ArrayUtils;

public class GraphicRegulator extends EObjectRegulator {

	@Override
	public XGraphic getModel() {
		return (XGraphic) super.getModel();
	}

	@Override
	public GraphicOutset getOutset() {
		return (GraphicOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XGraphic model = getModel();
		EList<XVariable> variables = model.getVariables();
		return ArrayUtils.push(super.getModelChildren(), new Object[] { variables });
	}

	@Override
	public void update() {
		super.update();
		updateRenderer();
		updateFormation();
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			Object feature = notification.getFeature();
			if (feature == XGraphic.FEATURE_RENDERER) {
				updateRenderer();
			} else if (feature == XGraphic.FEATURE_FORMATION) {
				updateFormation();
			}
		}
	}

	private void updateRenderer() {
		XGraphic model = getModel();
		String renderer = model.getRenderer();
		GraphicOutset outset = getOutset();
		outset.setRenderer(renderer);
	}

	private void updateFormation() {
		XGraphic model = getModel();
		String formation = model.getFormation();
		GraphicOutset outset = getOutset();
		outset.setFormation(formation);
	}

}
