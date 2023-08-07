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
package com.andia.mixin.padang.dumai.sources;

import com.andia.mixin.plan.QualifiedPlan;
import com.andia.mixin.plan.SpecifiedPlan;
import com.andia.mixin.plan.SpecifiedPlanList;

public class ImageCameraSource implements Source {

	private static final String DEVICE_ID = "deviceId";

	public static QualifiedPlan getPlan() {

		QualifiedPlan plan = new QualifiedPlan(ImageCameraSource.class);
		plan.setLabel("Image Camera");
		SpecifiedPlanList parameters = plan.getParameters();

		SpecifiedPlan deviceId = parameters.addNumberPlan(DEVICE_ID, 0);
		deviceId.setLabel("Device ID");

		return plan;
	}

}
