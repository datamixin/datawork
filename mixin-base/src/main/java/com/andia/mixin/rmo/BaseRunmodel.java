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

import com.andia.mixin.model.EObject;

public abstract class BaseRunmodel implements Runmodel {

	private RegulatorFactory regulatorFactory;
	private OutsetFactory outsetFactory;
	private RootRegulator rootRegulator = new RootRegulator();
	private Map<Class<?>, Object> capabilities = new HashMap<>();

	public BaseRunmodel() {
		rootRegulator.setRunmodel(this);
	}

	protected void setRegulatorFactory(RegulatorFactory factory) {
		this.regulatorFactory = factory;
	}

	protected void setOutsetFactory(OutsetFactory factory) {
		this.outsetFactory = factory;
	}

	@Override
	public Object getModel() {
		Regulator contents = rootRegulator.getContents();
		return contents.getModel();
	}

	public void modify(Modification modification) {
		Regulator regulator = rootRegulator.getContents();
		Object model = regulator.getModel();
		if (model instanceof EObject) {
			EObject eObject = (EObject) model;
			EObjectModifier modifier = new EObjectModifier(modification);
			modifier.modify(eObject);
		}
	}

	@Override
	public RegulatorFactory getRegulatorFactory() {
		return this.regulatorFactory;
	}

	@Override
	public OutsetFactory getOutsetFactory() {
		return outsetFactory;
	}

	@Override
	public void registerCapability(Class<?> capabilityClass, Object service) {
		this.capabilities.put(capabilityClass, service);
	}

	@Override
	public <C> C getCapability(Class<? extends C> capabilityClass) {

		Object capability = capabilities.get(capabilityClass);

		// Cari menggunakan class sebagai interface
		if (capability == null) {
			for (Class<?> keyClass : capabilities.keySet()) {
				Object value = capabilities.get(keyClass);
				Class<?> valueClass = value.getClass();
				if (capabilityClass.isAssignableFrom(keyClass)) {
					capability = value;
					break;
				}
				if (capabilityClass.isAssignableFrom(valueClass)) {
					capability = value;
					break;
				}
			}
		}

		return capabilityClass.cast(capability);
	}

	public RootRegulator getRootRegulator() {
		return this.rootRegulator;
	}

	@Override
	public Supervisor getSupervisor() {
		return this.rootRegulator.getContents();
	}

	@Override
	public void postIndication(Indication indication) {

	}

	@Override
	public void postRectification(Modification rectification) {

	}

}
