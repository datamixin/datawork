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
package com.andia.mixin.padang.model;

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;

public class XMutation extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XMutation");

	public static EAttribute FEATURE_OPERATION = new EAttribute("operation", EAttribute.STRING);
	public static EReference FEATURE_OPTIONS = new EReference("options", XOption.class);

	private String operation = null;
	private EList<XOption> options = new BasicEList<XOption>(this, XMutation.FEATURE_OPTIONS);

	public XMutation() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XMutation.FEATURE_OPERATION,
				XMutation.FEATURE_OPTIONS
		});
	}

	public String getOperation() {
		return this.operation;
	}

	public void setOperation(String newOperation) {
		String oldOperation = this.operation;
		this.operation = newOperation;
		this.eSetNotify(XMutation.FEATURE_OPERATION, oldOperation, newOperation);
	}

	public EList<XOption> getOptions() {
		return this.options;
	}

}
