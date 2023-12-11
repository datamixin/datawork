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

import com.andia.mixin.model.EList;
import com.andia.mixin.model.Notification;
import com.andia.mixin.padang.model.XBuilder;
import com.andia.mixin.padang.model.XVariable;
import com.andia.mixin.padang.outset.BuilderOutset;
import com.andia.mixin.util.ArrayUtils;

public class BuilderRegulator extends ForeseeRegulator {

	@Override
	public XBuilder getModel() {
		return (XBuilder) super.getModel();
	}

	@Override
	public BuilderOutset getOutset() {
		return (BuilderOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XBuilder model = getModel();
		EList<XVariable> variables = model.getVariables();
		return ArrayUtils.push(super.getModelChildren(), new Object[] { variables });
	}

	@Override
	public void update() {
		super.update();
		updateRevision();
		updateStructure();
		updateExplanation();
	}

	@Override
	public void notifyChanged(Notification notification) {
		super.notifyChanged(notification);
		int eventType = notification.getEventType();
		if (eventType == Notification.SET) {
			Object feature = notification.getFeature();
			if (feature == XBuilder.FEATURE_REVISION) {
				updateRevision();
			} else if (feature == XBuilder.FEATURE_STRUCTURE) {
				updateStructure();
			} else if (feature == XBuilder.FEATURE_EXPLANATION) {
				updateExplanation();
			}
		}
	}

	private void updateRevision() {
		XBuilder model = getModel();
		String revision = model.getRevision();
		BuilderOutset outset = getOutset();
		outset.setRevision(revision);
	}

	private void updateStructure() {
		XBuilder model = getModel();
		String structure = model.getStructure();
		BuilderOutset outset = getOutset();
		outset.setStructure(structure);
	}

	private void updateExplanation() {
		XBuilder model = getModel();
		String formation = model.getExplanation();
		BuilderOutset outset = getOutset();
		outset.setExplanation(formation);
	}

}
