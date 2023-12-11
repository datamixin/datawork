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
package com.andia.mixin.bekasi;

import java.util.UUID;

import com.andia.mixin.bekasi.reconciles.IndicationReconcile;
import com.andia.mixin.bekasi.reconciles.Reconcile;
import com.andia.mixin.bekasi.reconciles.RectificationReconcile;
import com.andia.mixin.bekasi.visage.VisageValue;
import com.andia.mixin.bekasi.visage.VisageValueFactory;
import com.andia.mixin.model.EObject;
import com.andia.mixin.rmo.BaseRunmodel;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.FeaturePath;
import com.andia.mixin.rmo.Indication;
import com.andia.mixin.rmo.InvokeIgniter;
import com.andia.mixin.rmo.InvokeIgniterException;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.rmo.Outset;
import com.andia.mixin.rmo.OutsetException;
import com.andia.mixin.rmo.OutsetInvoker;
import com.andia.mixin.rmo.Regulator;
import com.andia.mixin.rmo.RegulatorFactory;
import com.andia.mixin.rmo.RegulatorVisitor;
import com.andia.mixin.rmo.RootRegulator;
import com.andia.mixin.rmo.RunmodelException;

public abstract class LifestageRunmodel extends BaseRunmodel {

	protected Lifestage lifestage;

	public LifestageRunmodel(Lifestage filestage) {
		this.lifestage = filestage;
	}

	private boolean isOpened() {
		UUID fileId = lifestage.getFileId();
		Openstack openstack = super.getCapability(Openstack.class);
		return openstack.isOpened(fileId);
	}

	@Override
	public void postIndication(Indication indication) {
		if (isOpened()) {
			Reconciler reconciler = super.getCapability(Reconciler.class);
			UUID fileId = lifestage.getFileId();
			Reconcile reconcile = new IndicationReconcile(fileId, indication);
			String space = lifestage.getSpace();
			reconciler.reconcile(space, reconcile);
		}
	}

	@Override
	public void postRectification(Modification rectification) {

		Runstate runstate = getCapability(Runstate.class);
		runstate.modify(rectification);

		if (isOpened()) {
			Reconciler reconciler = super.getCapability(Reconciler.class);
			UUID fileId = lifestage.getFileId();
			Reconcile reconcile = new RectificationReconcile(fileId, rectification);
			String space = lifestage.getSpace();
			reconciler.reconcile(space, reconcile);
		}

	}

	protected void updateContents(Object model) {
		RegulatorFactory factory = getRegulatorFactory();
		Regulator regulator = (Regulator) factory.create(model);
		RootRegulator rootRegulator = getRootRegulator();
		rootRegulator.setContents(regulator);
	}

	@Override
	public EObject getModel() {
		return (EObject) super.getModel();
	}

	public abstract void setContents(EObject model) throws RunmodelException;

	public Regulator getRegulator() {
		RootRegulator rootRegulator = getRootRegulator();
		Regulator regulator = rootRegulator.getContents();
		return regulator;
	}

	public abstract Outset getOutset();

	public Object checkupState(FeatureCall call) throws RunmodelException {
		FeaturePath path = call.getPath();
		RegulatorVisitor visitor = new RegulatorVisitor(path, (regulator) -> {
			try {
				String name = call.getName();
				Object[] arguments = call.getArguments();
				InvokeIgniter igniter = new InvokeIgniter(regulator);
				return igniter.ignite(name, arguments);
			} catch (InvokeIgniterException e) {
				throw new OutsetException("Fail checkup state", e);
			}
		});
		try {
			Regulator regulator = getRegulator();
			Object value = visitor.visit(regulator);
			return value;
		} catch (Exception e) {
			throw new RunmodelException("Fail checking up state", e);
		}
	}

	public Object performAction(FeatureCall call) throws RunmodelException {
		return invokeMethod(call);
	}

	public Object inspectValue(FeatureCall call) throws RunmodelException {
		Object value = invokeMethod(call);
		try {
			if (value instanceof VisageValue) {
				return value;
			} else {
				VisageValueFactory factory = VisageValueFactory.getInstance();
				return factory.create(value);
			}
		} finally {
			System.gc();
		}
	}

	protected Object invokeMethod(FeatureCall call) throws RunmodelException {
		Regulator regulator = getRegulator();
		OutsetInvoker inspector = new OutsetInvoker(call);
		try {
			Object value = inspector.invoke(regulator);
			return value;
		} catch (Exception e) {
			throw new RunmodelException("Fail performing action on outset", e);
		}
	}

	public abstract Adjustment createAdjustment();

}
