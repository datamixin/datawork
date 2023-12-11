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

import java.util.Arrays;
import java.util.Map;

import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.Notification;

public class EObjectModifier {

	private Modification modification;

	public EObjectModifier(Modification modification) {
		this.modification = modification;
	}

	public void modify(EObject eObject) {
		FeaturePath path = modification.getPath();
		FeatureKey[] keys = path.getKeys();
		if (keys.length > 0) {
			visit(eObject, keys, 0);
		}
	}

	private void visit(EObject eObject, FeatureKey[] keys, int index) {

		FeatureKey key = keys[index];
		String name = key.getName();
		EFeature feature = eObject.eFeature(name);
		if (feature == null) {
			EClass eClass = eObject.eClass();
			String className = eClass.getName();
			throw new EObjectModifierException("Missing feature [" + name + "] at [" + className + "]");
		}

		Object value = eObject.eGet(feature);

		// Sebelum key terakhir pencarian masih recursive
		int length = keys.length;
		if (index < length - 1) {

			if (key instanceof MapFeatureKey) {

				Object mapKey = getMapKey(key);
				EMap<Object> map = asEMap(value);
				Object object = map.get(mapKey);
				visit(object, keys, index + 1);

			} else if (key instanceof ListFeatureKey) {

				int listPosition = getListPosition(key);
				EList<Object> list = asEList(value);
				Object object = list.get(listPosition);
				visit(object, keys, index + 1);

			} else {

				visit(value, keys, index + 1);
			}
		} else {

			// Key terakhir adalah feature yang di-modify
			modify(eObject, key, feature, value);
		}
	}

	@SuppressWarnings("unchecked")
	private void modify(EObject eObject, FeatureKey featureKey, EFeature feature, Object value) {

		int type = modification.getType();
		Object oldValue = modification.getOldValue();
		Object newValue = modification.getNewValue();

		if (value instanceof EMap) {

			EMap<Object> map = (EMap<Object>) value;
			String mapKey = getMapKey(featureKey);

			if (type == Notification.SET) {
				map.put(mapKey, newValue);
			} else if (type == Notification.REMOVE) {
				map.remove(mapKey);
			} else if (type == Notification.REPLACE_MANY) {
				map.repopulate((Map<String, Object>) newValue);
			} else {
				throw new EObjectModifierException("Unknown modification type " + type);
			}

		} else if (value instanceof EList<?>) {

			EList<Object> list = asEList(value);
			int listPosition = getListPosition(featureKey);
			if (type == Notification.ADD) {
				if (listPosition == -1) {
					list.add(newValue);
				} else {
					list.add(listPosition, newValue);
				}
			} else if (type == Notification.REMOVE) {
				list.remove(listPosition);
			} else if (type == Notification.MOVE) {
				int newPosition = (Integer) newValue;
				Object object = list.get(listPosition);
				list.move(object, newPosition);
			} else if (type == Notification.SET) {
				list.set(listPosition, newValue);
			} else if (type == Notification.ADD_MANY) {
				Object[] newRange = (Object[]) newValue;
				int rangeSize = newRange.length;
				if (listPosition == -1 && rangeSize == list.size()) {
					list.addAll(Arrays.asList(newRange));
				} else {
					list.insertRange(Arrays.asList(newRange), listPosition);
				}
			} else if (type == Notification.REMOVE_MANY) {
				Object[] oldRange = (Object[]) oldValue;
				int rangeSize = oldRange.length;
				if (listPosition == -1 && rangeSize == list.size()) {
					list.clear();
				} else {
					list.removeRange(listPosition, listPosition + rangeSize);
				}
			} else if (type == Notification.REPLACE_MANY) {
				list.repopulate(Arrays.asList((Object[]) newValue));
			} else {
				throw new EObjectModifierException("Unknown modification type " + type);
			}

		} else {

			if (type == Notification.SET) {
				eObject.eSet(feature, newValue);
			} else {
				throw new EObjectModifierException("Unknown modification type " + type);
			}
		}
	}

	private String getMapKey(FeatureKey featureKey) {
		MapFeatureKey mapFeatureKey = (MapFeatureKey) featureKey;
		String mapKey = mapFeatureKey.getKey();
		return mapKey;
	}

	private int getListPosition(FeatureKey featureKey) {
		ListFeatureKey listFeatureKey = (ListFeatureKey) featureKey;
		int listPosition = listFeatureKey.getPosition();
		return listPosition;
	}

	@SuppressWarnings("unchecked")
	private EMap<Object> asEMap(Object value) {
		EMap<Object> map = (EMap<Object>) value;
		return map;
	}

	@SuppressWarnings("unchecked")
	private EList<Object> asEList(Object value) {
		EList<Object> list = (EList<Object>) value;
		return list;
	}

	private void visit(Object object, FeatureKey[] keys, int index) {
		if (object instanceof EObject) {
			EObject eObject = (EObject) object;
			visit(eObject, keys, index);
		} else {
			throw new EObjectModifierException("Object '" + object + "' not instanceof EObject");
		}
	}

}
