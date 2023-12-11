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

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.model.EObject;
import com.andia.mixin.model.Namespace;
import com.andia.mixin.sleman.model.Sleman;
import com.andia.mixin.sleman.model.SlemanPackage;

class BasePadangPackage implements PadangPackage {

	private Map<String, Class<? extends EObject>> map = new HashMap<>();

	public BasePadangPackage() {
		this.map.put(XCell.XCLASSNAME, XCell.class);
		this.map.put(XInput.XCLASSNAME, XInput.class);
		this.map.put(XSheet.XCLASSNAME, XSheet.class);
		this.map.put(XFigure.XCLASSNAME, XFigure.class);
		this.map.put(XOption.XCLASSNAME, XOption.class);
		this.map.put(XBuilder.XCLASSNAME, XBuilder.class);
		this.map.put(XOutlook.XCLASSNAME, XOutlook.class);
		this.map.put(XOutcome.XCLASSNAME, XOutcome.class);
		this.map.put(XProject.XCLASSNAME, XProject.class);
		this.map.put(XMixture.XCLASSNAME, XMixture.class);
		this.map.put(XDataset.XCLASSNAME, XDataset.class);
		this.map.put(XViewset.XCLASSNAME, XViewset.class);
		this.map.put(XTabular.XCLASSNAME, XTabular.class);
		this.map.put(XGraphic.XCLASSNAME, XGraphic.class);
		this.map.put(XMutation.XCLASSNAME, XMutation.class);
		this.map.put(XVariable.XCLASSNAME, XVariable.class);
		this.map.put(XEstimator.XCLASSNAME, XEstimator.class);
		this.map.put(XIngestion.XCLASSNAME, XIngestion.class);
		this.map.put(XPreparation.XCLASSNAME, XPreparation.class);
	}

	@Override
	public Namespace getMainNamespace() {
		return Padang.NAMESPACE;
	}

	@Override
	public Namespace[] getNamespaces() {
		return new Namespace[] { Padang.NAMESPACE, Sleman.NAMESPACE };
	}

	@Override
	public Class<? extends EObject> getDefinedEClass(String eClassName) {
		return this.map.get(eClassName);
	}

	@Override
	public Class<? extends EObject> getEClass(String eClassName) {
		Class<? extends EObject> definedEClass = this.getDefinedEClass(eClassName);
		if (definedEClass == null) {
			SlemanPackage slemanPackage = SlemanPackage.eINSTANCE;
			Class<? extends EObject> importedClass = slemanPackage.getEClass(eClassName);
			return importedClass;
		} else {
			return definedEClass;
		}
	}

	@Override
	public PadangFactory getEFactoryInstance() {
		return PadangFactory.eINSTANCE;
	}

}