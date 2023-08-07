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

import com.andia.mixin.model.EObject;
import com.andia.mixin.util.ArrayUtils;

public class FeaturePathUtils {

	private FeaturePathUtils() {

	}

	public static FeaturePath fromQualified(String qualifiedPath) {

		String[] parts = qualifiedPath.split("/");
		FeatureKey[] keys = new FeatureKey[parts.length];
		for (int i = 0; i < keys.length; i++) {
			String part = parts[i];

			if (part.indexOf(ListFeatureKey.SEPARATOR) > 0) {

				int hash = part.indexOf(ListFeatureKey.SEPARATOR);
				String name = part.substring(0, hash);
				String indexString = part.substring(hash + 1);
				int position = Integer.parseInt(indexString);
				keys[i] = new ListFeatureKey(name, position);

			} else if (part.indexOf(MapFeatureKey.SEPARATOR) > 0) {

				int hash = part.indexOf(MapFeatureKey.SEPARATOR);
				String name = part.substring(0, hash);
				String key = part.substring(hash + 1);
				keys[i] = new MapFeatureKey(name, key);

			} else {

				keys[i] = new FeatureKey(part);

			}
		}
		return new FeaturePath(keys);
	}

	public static FeaturePath fromModel(EObject model) {
		FeatureKey[] keys = FeatureKeyUtils.fromModel(model);
		return new FeaturePath(keys);
	}

	public static FeaturePath fromModel(EObject model, FeatureKey... keys) {
		FeatureKey[] modelKeys = FeatureKeyUtils.fromModel(model);
		FeatureKey[] newKeys = (FeatureKey[]) ArrayUtils.splice(keys, 0, 0, modelKeys);
		return new FeaturePath(newKeys);
	}

}
