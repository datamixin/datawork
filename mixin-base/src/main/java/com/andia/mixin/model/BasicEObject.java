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

import java.lang.reflect.Method;
import java.util.Collection;

import com.andia.mixin.util.MethodUtils;

public class BasicEObject extends EObject {

	private AdapterList adapters = new AdapterList();
	private EFeature[] features = new EFeature[0];
	private EClass classType = null;
	private BasicEObject container = null;
	private EFeature containingFeature = null;

	public BasicEObject(EClass eClass, EFeature[] features) {
		super();
		this.classType = eClass;
		this.features = features;
	}

	@Override
	public EClass eClass() {
		return this.classType;
	}

	@Override
	public EFeature eFeature(String id) {
		for (EFeature feature : features) {
			String featureId = feature.getName();
			if (featureId.equals(id)) {
				return feature;
			}
		}
		return null;
	}

	@Override
	public EFeature[] eFeatures() {
		return this.features;
	}

	@Override
	public Object eGet(EFeature feature) {
		String name = feature.getName();
		Class<? extends BasicEObject> eClass = this.getClass();
		Method[] methods = eClass.getMethods();
		for (Method method : methods) {
			String methodName = method.getName();
			String field = MethodUtils.checkGetOrIsField(methodName);
			if (field == null || !field.equals(name) || method.getParameterCount() != 0) {
				continue;
			}
			try {
				return method.invoke(this);
			} catch (Exception e) {
				throw new EException("Fail invoke " + methodName + " to get field " + name, e);
			}
		}
		throw new EException("Missing method to get field " + name + " at " + eClass);
	}

	@Override
	public void eSet(EFeature feature, Object newValue) {

		// Lepas value baru dari container sebelumnya.
		if (newValue instanceof EObject) {
			EUtils.remove((EObject) newValue);
		}

		// Berikan value baru ke object ini.
		String name = feature.getName();
		Class<? extends BasicEObject> eClass = this.getClass();
		Method[] methods = eClass.getMethods();
		for (Method method : methods) {
			String methodName = method.getName();
			String field = MethodUtils.checkSetField(methodName);
			if (field == null || !field.equals(name) || method.getParameterCount() != 1) {
				continue;
			}
			try {
				method.invoke(this, newValue);
				return;
			} catch (Exception e) {
				throw new EException("Fail set field '" + name + "'", e);
			}
		}
		throw new EException("Missing method to set field '" + name + "' at '" + eClass + "'");
	}

	protected void eSetNotify(EFeature feature, Object oldValue, Object newValue) {
		notify(Notification.SET, feature, oldValue, newValue, -1, null);
	}

	@Override
	public AdapterList eAdapters() {
		return this.adapters;
	}

	@Override
	public EObject eContainer() {
		return this.container;
	}

	@Override
	public EFeature eContainingFeature() {
		return this.containingFeature;
	}

	@Override
	@SuppressWarnings("unchecked")
	public void notify(int eventType, EFeature feature, Object oldValue, Object newValue, int position, String key) {

		// Setting container dan featureId di old value menjadi null
		if (oldValue instanceof BasicEObject) {
			BasicEObject eObject = (BasicEObject) oldValue;
			this.setContainerFeature(eObject, null, null);
		} else if (oldValue instanceof Collection) {
			Collection<Object> collection = (Collection<Object>) oldValue;
			for (Object object : collection) {
				if (object instanceof BasicEObject) {
					BasicEObject eObject = (BasicEObject) object;
					this.setContainerFeature(eObject, null, null);
				}
			}
		}

		// Setting container dan featureId di new value
		if (newValue instanceof BasicEObject) {
			BasicEObject eObject = (BasicEObject) newValue;
			this.setContainerFeature(eObject, this, feature);
		} else if (newValue instanceof Collection) {
			Collection<Object> collection = (Collection<Object>) newValue;
			for (Object object : collection) {
				if (object instanceof BasicEObject) {
					BasicEObject eObject = (BasicEObject) object;
					this.setContainerFeature(eObject, this, feature);
				}
			}
		}

		// Notification akan di berikan ke synchronizer dan adapters
		Notification notification = new Notification(this, eventType, feature, oldValue, newValue, position, key);
		this.notifyAdapters(notification);

	}

	private void notifyAdapters(Notification notification) {

		// Lakukan notifikasi ke semua adapter
		for (Adapter adapter : this.adapters) {
			adapter.notifyChanged(notification);
		}

		// Notify ke adapter yang extends ContentAdapter
		this.notifyContentAdapter((BasicEObject) this.container, notification);
	}

	private void notifyContentAdapter(BasicEObject eObject, Notification notification) {

		if (eObject != null) {

			// Ambil daftar adapters
			for (Adapter adapter : eObject.adapters) {

				// Notify content adapter yang ada di eObject ini
				if (adapter instanceof ContentAdapter) {
					adapter.notifyChanged(notification);
				}
			}

			// Notify content adapter yang ada di container
			BasicEObject container = eObject.container;
			this.notifyContentAdapter(container, notification);
		}
	}

	private void setContainerFeature(BasicEObject eObject, BasicEObject container, EFeature feature) {

		// Berikan parent baru
		eObject.container = container;
		eObject.containingFeature = feature;
	}

}
