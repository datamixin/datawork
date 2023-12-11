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
package com.andia.mixin.padang.dumai.sources;

import com.andia.mixin.plan.QualifiedPlan;
import com.andia.mixin.plan.SpecifiedPlan;
import com.andia.mixin.plan.SpecifiedPlanList;

public class ImageFolderSource implements Source {

	private static final String PATH = "path";
	private static final String PATTERN = "pattern";

	public static QualifiedPlan getPlan() {

		QualifiedPlan plan = new QualifiedPlan(ImageCameraSource.class);
		plan.setLabel("Image Folder");
		SpecifiedPlanList parameters = plan.getParameters();

		SpecifiedPlan path = parameters.addTextPlan(PATH, "./");
		path.setLabel("Path");

		SpecifiedPlan pattern = parameters.addTextPlan(PATTERN, "*.*");
		pattern.setLabel("Pattern");

		return plan;

	}

}
