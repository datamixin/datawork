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
package com.andia.mixin.padang;

import java.util.UUID;

import com.andia.mixin.bekasi.Adjustment;
import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.EngineryException;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.bekasi.LifestageRunmodel;
import com.andia.mixin.model.EObject;
import com.andia.mixin.padang.model.XProject;
import com.andia.mixin.padang.outset.ProjectOutset;
import com.andia.mixin.padang.regulator.ProjectRegulatorFactory;
import com.andia.mixin.rmo.OutsetFactory;
import com.andia.mixin.rmo.Regulator;
import com.andia.mixin.rmo.RunmodelException;

public class ProjectRunmodel extends LifestageRunmodel {

	public ProjectRunmodel(Lifestage lifestage, Enginery enginery) throws EngineryException {
		super(lifestage);
		prepareOutsetFactory(enginery);
		prepareCapabilities(enginery, lifestage);
		setRegulatorFactory(new ProjectRegulatorFactory());
	}

	private void prepareOutsetFactory(Enginery enginery) {
		OutsetFactory factory = enginery.createOutsetFactory();
		setOutsetFactory(factory);
	}

	private void prepareCapabilities(Enginery enginery, Lifestage lifestage) throws EngineryException {
		enginery.installCapabilities(this, lifestage);
	}

	@Override
	public void setContents(EObject model) throws RunmodelException {
		updateContents(model);
	}

	@Override
	public XProject getModel() {
		Regulator regulator = getRegulator();
		return (XProject) regulator.getModel();
	}

	public ProjectOutset getOutset() {
		Regulator regulator = getRegulator();
		ProjectOutset outset = (ProjectOutset) regulator.getOutset();
		return outset;
	}

	@Override
	public Adjustment createAdjustment() {
		Regulator regulator = getRegulator();
		UUID fileId = lifestage.getFileId();
		return new ProjectAdjustment(fileId, regulator);
	}

}
