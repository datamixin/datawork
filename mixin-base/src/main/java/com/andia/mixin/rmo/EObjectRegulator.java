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
package com.andia.mixin.rmo;

import java.util.LinkedHashMap;
import java.util.Map;

import com.andia.mixin.model.AdapterList;
import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EObject;

public abstract class EObjectRegulator extends AdapterRegulator {

	public final static String CHECKUP_PROBLEM_LIST = "problem-list";
	public final static String CHECKUP_PROBLEM_COUNTER = "problem-counter";

	private FeatureKey[] keys;
	private String qualifiedPath;

	private Map<EFeature, OutsetList<?>> outsetListMap = new LinkedHashMap<>();

	@Override
	public void setModel(Object object) {
		super.setModel(object);
		EObject model = (EObject) object;
		FeaturePath path = FeaturePathUtils.fromModel(model);
		keys = path.getKeys();
		qualifiedPath = path.toQualified();
	}

	public EObject getModel() {
		return (EObject) super.getModel();
	}

	@Override
	protected AdapterList getAdapters() {
		EObject model = getModel();
		AdapterList adapters = model.eAdapters();
		return adapters;
	}

	@Override
	protected Outset createOutset() {

		OutsetFactory factory = getOutsetFactory();
		try {

			EObject model = getModel();
			EClass eClass = model.eClass();
			String name = eClass.getName();

			EFeature[] features = model.eFeatures();
			for (EFeature feature : features) {

				String key = factory.asFeatureKey(name, feature);
				if (factory.isExists(key)) {
					OutsetList<?> outsetList = (OutsetList<?>) factory.create(this, key);
					registerOutsetList(feature, outsetList);
				}

			}

			return factory.create(this, name);

		} catch (OutsetException e) {

			Class<? extends Regulator> rClass = this.getClass();
			throw new RegulatorException("Fail create outset for " + rClass.getSimpleName(), e);

		}

	}

	private void registerOutsetList(EFeature feature, OutsetList<?> list) {
		outsetListMap.put(feature, list);
	}

	@Override
	protected void addChildOutset(Regulator child, int index) {

		if (child instanceof EListRegulator) {

			// Khusus EListRegulator berikan langsung instance-nya
			EListRegulator regulator = (EListRegulator) child;
			EList<?> list = regulator.getModel();
			EFeature feature = list.eFeature();
			OutsetList<?> outset = outsetListMap.get(feature);
			if (outset != null) {
				regulator.setOutset(outset);
			} else {
				String name = feature.getName();
				String s = "Missing outset list for '" + name + "'";
				throw new RegulatorException(s);
			}
		}

		super.addChildOutset(child, index);
	}

	@Override
	public String getQualifiedPath() {
		return qualifiedPath;
	}

	@Override
	public FeatureKey[] getFeatureKeys() {
		return keys;
	}

}
