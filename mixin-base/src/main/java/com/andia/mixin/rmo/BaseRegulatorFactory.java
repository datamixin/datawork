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
package com.andia.mixin.rmo;

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EObject;

public class BaseRegulatorFactory implements RegulatorFactory {

	protected Map<String, Class<? extends Regulator>> regulators = new HashMap<>();

	protected void register(String className, Class<? extends Regulator> regulatorClass) {
		this.regulators.put(className, regulatorClass);
	}

	protected void registerList(String className, EFeature feature, Class<? extends Regulator> regulatorClass) {
		String key = asKey(className, feature);
		register(key, regulatorClass);
	}

	private String asKey(String className, EFeature feature) {
		return className + "." + feature.getName();
	}

	@Override
	public Regulator create(Object model) throws RegulatorException {

		if (model == null) {
			throw new RegulatorException("Cannot create regulator from null model");
		}

		Class<? extends Regulator> regulatorClass = null;

		if (model instanceof EList) {

			// Jika model adalah EList maka regulator-nya EListRegulator
			EList<?> list = (EList<?>) model;
			EObject owner = list.eOwner();
			EFeature feature = list.eFeature();

			EClass eClass = owner.eClass();
			String className = eClass.getName();

			String key = this.asKey(className, feature);
			regulatorClass = this.regulators.get(key);

		} else if (model instanceof EObject) {

			// Jika model EObject maka regulator-nya EObjectRegulator
			EClass eClass = ((EObject) model).eClass();
			String key = eClass.getName();
			regulatorClass = this.regulators.get(key);

		} else {
			throw new RegulatorException("Model " + model + " must be EObjectEList or EObject");
		}

		if (regulatorClass != null) {
			try {

				// Construct regulator dan berikan model
				Regulator regulator = regulatorClass.newInstance();
				regulator.setModel(model);
				return regulator;
			} catch (InstantiationException | IllegalAccessException e) {
				String s = "Fail create regulator " + regulatorClass;
				throw new RegulatorException(s, e);
			}
		} else {
			Class<? extends Object> modelClass = model.getClass();
			throw new RegulatorException("Missing regulator for " + modelClass.getSimpleName());
		}
	}
}
