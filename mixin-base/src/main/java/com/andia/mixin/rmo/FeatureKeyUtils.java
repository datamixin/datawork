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

import java.util.Set;

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.EObject;
import com.andia.mixin.util.ArrayUtils;

public class FeatureKeyUtils {

	private FeatureKeyUtils() {

	}

	public static FeatureKey[] fromModel(EObject model) {

		FeatureKey[] keys = new FeatureKey[0];
		EObject container = model.eContainer();

		while (container != null) {

			String featureId = null;
			FeatureKey featureKey = null;
			EFeature feature = model.eContainingFeature();
			featureId = feature.getName();
			Object object = container.eGet(feature);

			if (object instanceof EList) {

				// Untuk feature list
				EList<?> list = (EList<?>) object;
				int position = list.indexOf(model);
				if (position != -1) {
					featureKey = new ListFeatureKey(featureId, position);
					model = container;
				}
				if (featureKey == null) {
					throw new Error("Fail seek value model while create ListFeatureKey");
				}

			} else if (object instanceof EMap) {

				// Untuk Feature Map
				EMap<?> map = (EMap<?>) object;
				Set<?> keySet = map.keySet();
				String[] mapKeys = keySet.toArray(new String[0]);
				for (int i = 0; i < mapKeys.length; i++) {
					String key = (String) mapKeys[i];
					Object value = map.get(key);
					if (value == model) {
						featureKey = new MapFeatureKey(featureId, key);
						model = container;
						break;
					}
				}
				if (featureKey == null) {
					throw new Error("Fail seek feature key while create MapFeatureKey");
				}

			} else {

				// Untuk feature biasa
				featureKey = new FeatureKey(featureId);
				model = model.eContainer();

			}
			container = container.eContainer();
			keys = (FeatureKey[]) ArrayUtils.splice(keys, 0, 0, featureKey);
		}
		return keys;
	}

}
