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
import com.andia.mixin.padang.model.XProject;
import com.andia.mixin.padang.model.XSheet;
import com.andia.mixin.padang.outset.ProjectOutset;
import com.andia.mixin.rmo.EObjectRegulator;

public class ProjectRegulator extends EObjectRegulator {

	@Override
	public XProject getModel() {
		return (XProject) super.getModel();
	}

	@Override
	public ProjectOutset getOutset() {
		return (ProjectOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XProject model = getModel();
		EList<XSheet> sheets = model.getSheets();
		return new Object[] { sheets };
	}

}
