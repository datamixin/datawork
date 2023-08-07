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
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";
import ModelNamespace from "webface/model/ModelNamespace";

import * as model from "padang/model/model";
import PadangPackage from "padang/model/PadangPackage";
import PadangFactory from "padang/model/PadangFactory";

import XCell from "padang/model/XCell";
import XInput from "padang/model/XInput";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XOption from "padang/model/XOption";
import XBuilder from "padang/model/XBuilder";
import XOutcome from "padang/model/XOutcome";
import XOutlook from "padang/model/XOutlook";
import XDataset from "padang/model/XDataset";
import XViewset from "padang/model/XViewset";
import XGraphic from "padang/model/XGraphic";
import XMixture from "padang/model/XMixture";
import XProject from "padang/model/XProject";
import XTabular from "padang/model/XTabular";
import XMutation from "padang/model/XMutation";
import XVariable from "padang/model/XVariable";
import XIngestion from "padang/model/XIngestion";
import XPreparation from "padang/model/XPreparation";

class BasicPadangPackage implements PadangPackage {

	private map: { [xClass: string]: typeof EObject } = {};

	constructor() {

		this.map[XCell.XCLASSNAME] = XCell;
		this.map[XInput.XCLASSNAME] = XInput;
		this.map[XSheet.XCLASSNAME] = XSheet;
		this.map[XFigure.XCLASSNAME] = XFigure;
		this.map[XOption.XCLASSNAME] = XOption;
		this.map[XOutcome.XCLASSNAME] = XOutcome;
		this.map[XOutlook.XCLASSNAME] = XOutlook;
		this.map[XProject.XCLASSNAME] = XProject;
		this.map[XMixture.XCLASSNAME] = XMixture;
		this.map[XDataset.XCLASSNAME] = XDataset;
		this.map[XBuilder.XCLASSNAME] = XBuilder;
		this.map[XGraphic.XCLASSNAME] = XGraphic;
		this.map[XViewset.XCLASSNAME] = XViewset;
		this.map[XTabular.XCLASSNAME] = XTabular;
		this.map[XMutation.XCLASSNAME] = XMutation;
		this.map[XVariable.XCLASSNAME] = XVariable;
		this.map[XIngestion.XCLASSNAME] = XIngestion;
		this.map[XPreparation.XCLASSNAME] = XPreparation;

	}

	public getNamespaces(): ModelNamespace[] {
		return [model.NAMESPACE];
	}

	public getDefinedEClass(eClassName: string): typeof EObject {
		return this.map[eClassName] || null;
	}

	public getEClass(eClassName: string): typeof EObject {
		let eClass = this.getDefinedEClass(eClassName);
		return eClass;
	}

	public getEFactoryInstance(): EFactory {
		return PadangFactory.eINSTANCE;
	}

}

PadangPackage.eINSTANCE = new BasicPadangPackage();
