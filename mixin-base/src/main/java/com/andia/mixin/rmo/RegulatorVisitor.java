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

import java.util.List;
import java.util.function.Function;

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EObject;

public class RegulatorVisitor {

	private FeaturePath path;
	private Function<Regulator, Object> function;

	public RegulatorVisitor(FeaturePath path, Function<Regulator, Object> consumer) {
		this.path = path;
		this.function = consumer;
	}

	public Object visit(Regulator regulator) throws OutsetException {
		FeatureKey[] keys = path.getKeys();
		if (keys.length == 0) {
			return doVisit(regulator);
		} else {
			return doVisit(regulator, keys, 0);
		}
	}

	private Object doVisit(Regulator regulator, FeatureKey[] keys, int index) throws OutsetException {

		FeatureKey key = keys[index];
		String name = key.getName();
		EObject eObject = (EObject) regulator.getModel();

		EFeature feature = eObject.eFeature(name);
		Object value = eObject.eGet(feature);

		List<Regulator> children = regulator.getChildren();
		for (Regulator child : children) {

			// Cari regulator yang mengendalikan model yang sama.
			Object model = child.getModel();
			if (model == value) {

				// Sebelum key terakhir pencarian masih recursive
				int length = keys.length;
				if (index < length - 1) {

					if (key instanceof ListFeatureKey) {
						ListFeatureKey listFeatureKey = (ListFeatureKey) key;
						int listPosition = listFeatureKey.getPosition();
						Regulator childRegulator = child.getChildRegulator(listPosition);
						return doVisit(childRegulator, keys, index + 1);
					} else {
						return doVisit(child, keys, index + 1);
					}

				} else {

					// Key terakhir adalah feature yang di-modify
					if (key instanceof ListFeatureKey) {
						ListFeatureKey listFeatureKey = (ListFeatureKey) key;
						int listPosition = listFeatureKey.getPosition();
						Regulator childRegulator = child.getChildRegulator(listPosition);
						return doVisit(childRegulator);
					} else {
						return doVisit(child);
					}

				}
			}
		}
		throw new OutsetException("Missing " + key + " regulator to visit");

	}

	private Object doVisit(Regulator regulator) throws OutsetException {
		return function.apply(regulator);
	}

}
