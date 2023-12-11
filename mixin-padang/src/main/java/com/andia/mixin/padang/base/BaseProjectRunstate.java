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
package com.andia.mixin.padang.base;

import java.util.UUID;

import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.EngineryException;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.bekasi.LifestageRunmodel;
import com.andia.mixin.bekasi.Reconciler;
import com.andia.mixin.bekasi.RunstateCreator;
import com.andia.mixin.bekasi.RunstateException;
import com.andia.mixin.bekasi.base.BaseRunstate;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EObjectSerde;
import com.andia.mixin.model.EPackage;
import com.andia.mixin.padang.ProjectRunmodel;
import com.andia.mixin.padang.ProjectRunstate;
import com.andia.mixin.padang.model.PadangPackage;
import com.andia.mixin.padang.model.XProject;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.RunmodelException;

public class BaseProjectRunstate extends BaseRunstate implements ProjectRunstate {

	public BaseProjectRunstate(Repository repository, String space, Reconciler reconciler,
			RunstateCreator creator, Enginery enginery, Consolidator consolidation, UUID fileId, UUID untitlesId) {
		super(repository, space, reconciler, creator, enginery, consolidation, fileId, untitlesId);
	}

	@Override
	public void setModel(XProject model) {
		super.setModel(model);
	}

	@Override
	public XProject getModel() {
		return (XProject) super.getModel();
	}

	@Override
	protected LifestageRunmodel createRunmodel(Lifestage filestage, Enginery enginery) throws RunstateException {
		try {
			return new ProjectRunmodel(filestage, enginery);
		} catch (EngineryException e) {
			throw new RunstateException("Fail create runmodel", e);
		}
	}

	@Override
	protected EObjectSerde<EObject> createSerde() {
		EPackage packages = PadangPackage.eINSTANCE;
		EObjectSerde<EObject> serde = new EObjectSerde<>(packages);
		return serde;
	}

	@Override
	public Object inspectValue(FeatureCall call) throws RunstateException {
		try {
			return ((ProjectRunmodel) runmodel).inspectValue(call);
		} catch (RunmodelException e) {
			throw new RunstateException("Fail inspect value for " + call, e);
		}
	}

}
