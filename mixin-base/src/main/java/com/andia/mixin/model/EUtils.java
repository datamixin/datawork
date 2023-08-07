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
package com.andia.mixin.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.function.Function;

// Model util mengikuti EcoreUtil di EMF
@SuppressWarnings("unchecked")
public class EUtils {

	public final static void replace(EObject oldModel, EObject newModel) {

		EObject container = oldModel.eContainer();
		if (container == null) {
			return;
		}

		EFeature feature = oldModel.eContainingFeature();
		if (feature == null) {
			return;
		}

		Object oldFeatureValue = container.eGet(feature);

		if (oldFeatureValue instanceof EList) {

			// Value is multiplicity many using EList
			EList<Object> list = (EList<Object>) oldFeatureValue;
			int oldIndex = list.indexOf(oldModel);
			list.set(oldIndex, newModel);

		} else if (oldFeatureValue instanceof EMap) {

			// Value is map (key -> value) using EMap
			EMap<Object> map = (EMap<Object>) oldFeatureValue;
			Set<String> keySet = map.keySet();
			for (String key : keySet) {
				Object existing = map.get(key);
				if (existing == oldModel) {
					map.put(key, newModel);
					break;
				}
			}

		} else {

			// Replace hanya apabila benar oldModel adalah oldFeatureValue di container
			if (oldModel == oldFeatureValue) {
				container.eSet(feature, newModel);
			}
		}
	}

	public final static void remove(EObject model) {

		EObject container = model.eContainer();
		EFeature feature = model.eContainingFeature();
		if (container == null || feature == null) {
			return;
		}

		Object containerFeatureValue = container.eGet(feature);
		if (containerFeatureValue instanceof EList) {

			// Value multiplicity many
			EList<Object> list = (EList<Object>) containerFeatureValue;
			list.remove(model);

		} else if (containerFeatureValue instanceof EMap) {

			EMap<Object> map = (EMap<Object>) containerFeatureValue;
			map.removeValue(model);

		} else {

			container.eSet(feature, null);
		}
	}

	public final static EObject copy(EObject eObject) {
		EClass eClass = eObject.eClass();
		EPackage ePackage = eClass.getEPackage();
		EFactory factory = ePackage.getEFactoryInstance();
		EObject copy = factory.create(eClass);
		imitate(eObject, copy);
		return copy;
	}

	private static void imitate(EObject eObject, EObject copy) {

		EFeature[] features = eObject.eFeatures();
		for (EFeature feature : features) {

			Object fieldValue = eObject.eGet(feature);

			if (fieldValue != null) {

				if (fieldValue instanceof EList) {

					EList<Object> eList = (EList<Object>) fieldValue;
					EList<Object> copyList = (EList<Object>) copy.eGet(feature);

					for (Object value : eList) {
						Object copyValue = createCopy(value);
						copyList.add(copyValue);
					}

				} else if (fieldValue instanceof EMap) {

					EMap<Object> eMap = (EMap<Object>) fieldValue;
					EMap<Object> copyMap = (EMap<Object>) copy.eGet(feature);
					Set<String> keys = eMap.keySet();

					for (String key : keys) {
						Object value = eMap.get(key);
						Object copyValue = createCopy(value);
						copyMap.put(key, copyValue);
					}

				} else {

					Object copyValue = createCopy(fieldValue);
					copy.eSet(feature, copyValue);
				}

			}
		}
	}

	private static Object createCopy(Object value) {
		if (value instanceof EObject) {
			EObject eObject = (EObject) value;
			return copy(eObject);
		} else {
			return value;
		}
	}

	public final static int getIndex(EObject model) {
		EFeature feature = model.eContainingFeature();
		EObject container = model.eContainer();
		if (container != null) {
			Object featureValue = container.eGet(feature);
			if (featureValue instanceof EList) {
				EList<Object> list = (EList<Object>) featureValue;
				return list.indexOf(model);
			}
		}
		return -1;
	}

	public final static EObject seekUp(EObject model, Class<? extends EObject> typeClass) {
		EObject container = model;
		return seekUp(typeClass, container);
	}

	public final static EObject seekUp(EHolder model, Class<? extends EObject> typeClass) {
		EObject container = model.eOwner();
		return seekUp(typeClass, container);
	}

	private static EObject seekUp(Class<? extends EObject> typeClass, EObject container) {
		while (container != null) {
			if (typeClass.isInstance(container)) {
				return container;
			}
			container = ((EObject) container).eContainer();
		}
		return container;
	}

	public final static boolean isAncestor(EObject ancestor, EObject model) {
		EObject container = model;
		while (container != null) {
			if (container == ancestor) {
				return true;
			}
			container = container.eContainer();
		}
		return false;
	}

	public final static EObject getRootContainer(Object model) {
		EObject eObject = getEObject(model);
		while (eObject != null) {
			EObject container = eObject.eContainer();
			if (container == null) {
				break;
			}
			eObject = container;
		}
		return eObject;
	}

	public final static EObject getEObject(Object model) {
		EObject eObject = null;
		if (model instanceof EObject) {
			eObject = (EObject) model;
		} else if (model instanceof EList) {
			EList<Object> list = (EList<Object>) model;
			eObject = list.eOwner();
		}
		return eObject;
	}

	public final static EObject getFirstDescendant(EObject model, Function<Object, Boolean> evaluate) {

		if (evaluate.apply(model) == true) {

			return model;

		} else {

			EFeature[] features = model.eFeatures();
			for (EFeature feature : features) {

				Object object = model.eGet(feature);

				if (object instanceof EObject) {

					EObject descendant = getFirstDescendant((EObject) object, evaluate);
					if (descendant != null) {
						return descendant;
					}

				} else if (object instanceof EList) {

					EList<Object> list = (EList<Object>) object;
					for (Object element : list) {
						if (element instanceof EObject) {
							EObject descendant = getFirstDescendant((EObject) element, evaluate);
							if (descendant != null) {
								return descendant;
							}
						}
					}

				} else if (object instanceof EMap) {

					EMap<Object> map = (EMap<Object>) object;
					Set<String> keys = map.keySet();
					for (String key : keys) {
						Object value = map.get(key);
						if (value instanceof EObject) {
							EObject descendant = getFirstDescendant((EObject) value, evaluate);
							if (descendant != null) {
								return descendant;
							}
						}
					}
				}
			}

			return null;
		}
	}

	public final static List<EObject> getDescendants(EObject model, Function<Object, Boolean> evaluate) {
		List<EObject> models = new ArrayList<>();
		discoverDescendants(model, evaluate, models);
		return models;
	}

	public final static void discoverDescendants(EObject model, Function<Object, Boolean> evaluate,
			List<EObject> models) {

		if (evaluate.apply(model) == true) {

			models.add(model);

		} else {

			EFeature[] features = model.eFeatures();
			for (EFeature feature : features) {

				Object object = model.eGet(feature);

				if (object instanceof EObject) {

					discoverDescendants((EObject) object, evaluate, models);

				} else if (object instanceof EList) {

					EList<Object> list = (EList<Object>) object;
					for (Object element : list) {
						if (element instanceof EObject) {
							discoverDescendants((EObject) element, evaluate, models);
						}
					}

				} else if (object instanceof EMap) {

					EMap<Object> map = (EMap<Object>) object;
					Set<String> keys = map.keySet();
					for (String key : keys) {
						Object value = map.get(key);
						if (value instanceof EObject) {
							discoverDescendants((EObject) value, evaluate, models);
						}
					}
				}
			}
		}
	}

	public final static boolean isEquals(EObject model, EObject other) {

		// Salah satu null model tidak sama
		if (model == null || other == null) {
			return model == null && other == null;
		}

		// Beda class beda model
		EClass modelClass = model.eClass();
		EClass otherClass = other.eClass();
		String modelName = modelClass.getFullName();
		String otherName = otherClass.getFullName();

		if (!modelName.equals(otherName)) {
			return false;
		}

		// Banding setiap feature
		EFeature[] features = model.eFeatures();
		for (int i = 0; i < features.length; i++) {

			EFeature feature = features[i];
			Object modelValue = model.eGet(feature);
			Object otherValue = other.eGet(feature);

			if (modelValue == null || otherValue == null) {

				if (!(modelValue == null && otherValue == null)) {
					return false;
				}

			} else {

				if (modelValue instanceof EObject) {

					EObject modelObject = (EObject) modelValue;
					EObject otherObject = (EObject) otherValue;
					if (isEquals(modelObject, otherObject) == false) {
						return false;
					}

				} else if (modelValue instanceof EList) {

					EList<Object> modelList = (EList<Object>) modelValue;
					EList<Object> otherList = (EList<Object>) otherValue;
					if (modelList.size() != otherList.size()) {
						return false;
					}

					for (int j = 0; j < modelList.size(); j++) {

						Object modelElement = modelList.get(j);
						Object otherElement = otherList.get(j);

						if (modelElement == null || otherElement == null) {
							if (!(modelElement == null && otherElement == null)) {
								return false;
							}
						}

						if (modelElement instanceof EObject) {

							EObject modelObject = (EObject) modelElement;
							EObject otherObject = (EObject) otherElement;

							if (isEquals(modelObject, otherObject) == false) {
								return false;
							}

						} else {

							if (modelElement == null && otherElement != null) {
								return false;
							} else if (modelElement != null && otherElement == null) {
								return false;
							} else if (modelElement == null && otherElement == null) {
								return true;
							} else if (!modelElement.equals(otherElement)) {
								return false;
							}
						}
					}

				} else if (modelValue instanceof EMap) {

					EMap<Object> modelMap = (EMap<Object>) modelValue;
					EMap<Object> otherMap = (EMap<Object>) otherValue;

					String[] modelKeys = modelMap.keySet().toArray(new String[0]);
					String[] otherKeys = otherMap.keySet().toArray(new String[0]);
					if (modelKeys.length != otherKeys.length) {
						return false;
					}

					for (int j = 0; j < modelKeys.length; j++) {

						String modelKey = modelKeys[j];
						String otherKey = otherKeys[j];

						if (!modelKey.equals(otherKey)) {
							return false;
						}

						Object modelObject = modelMap.get(modelKey);
						Object otherObject = otherMap.get(otherKey);

						if (modelObject == null || otherObject == null) {
							if (!(modelObject == null && otherObject == null)) {
								return false;
							}
						}

						if (modelObject instanceof EObject) {
							EObject modelEObject = (EObject) modelObject;
							EObject otherEObject = (EObject) otherObject;

							if (isEquals(modelEObject, otherEObject) == false) {
								return false;
							}

						} else {

							if (modelObject == null && otherObject != null) {
								return false;
							} else if (modelObject != null && otherObject == null) {
								return false;
							} else if (modelObject == null && otherObject == null) {
								return true;
							} else if (!modelObject.equals(otherObject)) {
								return false;
							}
						}
					}
				} else {

					if (!(modelValue.equals(otherValue))) {
						return false;
					}
				}
			}

		}

		return true;
	}

}