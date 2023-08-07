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

import com.andia.mixin.model.Notification;
import com.andia.mixin.padang.model.XFigure;
import com.andia.mixin.padang.model.XGraphic;
import com.andia.mixin.padang.outset.FigureOutset;

public class FigureRegulator extends FacetRegulator {

	@Override
	public XFigure getModel() {
		return (XFigure) super.getModel();
	}

	@Override
	public FigureOutset getOutset() {
		return (FigureOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XFigure model = getModel();
		XGraphic graphic = model.getGraphic();
		return new Object[] { graphic };
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
			if (feature == XFigure.FEATURE_NAME) {
				updateName();
			} else if (feature == XFigure.FEATURE_GRAPHIC) {
				updateChildren();
			}
		}
	}

	private void updateName() {
		XFigure model = getModel();
		String name = model.getName();
		FigureOutset outset = getOutset();
		outset.setName(name);
	}

}
