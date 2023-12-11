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
import EClass from "webface/model/EClass";
import EObject from "webface/model/EObject";

import * as  builder from "webface/model/builder";

import PadangPackage from "padang/model/PadangPackage";
import PadangFactory from "padang/model/PadangFactory";

import XCell from "padang/model/XCell";
import XInput from "padang/model/XInput";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XOption from "padang/model/XOption";
import XOutcome from "padang/model/XOutcome";
import XOutlook from "padang/model/XOutlook";
import XDataset from "padang/model/XDataset";
import XViewset from "padang/model/XViewset";
import XMixture from "padang/model/XMixture";
import XProject from "padang/model/XProject";
import XTabular from "padang/model/XTabular";
import XGraphic from "padang/model/XGraphic";
import XBuilder from "padang/model/XBuilder";
import XMutation from "padang/model/XMutation";
import XVariable from "padang/model/XVariable";
import XIngestion from "padang/model/XIngestion";
import XPreparation from "padang/model/XPreparation";

import PointerField from "padang/model/PointerField";

export default class BasicPadangFactory implements PadangFactory {

	public create(xClass: EClass): EObject {
		let name = xClass.getName();
		let ePackage = PadangPackage.eINSTANCE;
		let xObject: any = ePackage.getEClass(name);
		return new xObject();
	}

	public createXCell(): XCell {
		return new XCell();
	}

	public createXSheet(): XSheet {
		return new XSheet();
	}

	public createXInput(): XInput {
		return new XInput();
	}

	public createXOutcome(): XOutcome {
		return new XOutcome();
	}

	public createXOutlook(): XOutlook {
		return new XOutlook();
	}

	public createXProject(): XProject {
		return new XProject();
	}

	public createXDataset(): XDataset {
		return new XDataset();
	}

	public createXViewset(): XViewset {
		return new XViewset();
	}

	public createXBuilder(): XBuilder {
		return new XBuilder();
	}

	public createXGraphic(): XGraphic {
		return new XGraphic();
	}

	public createXMixture(): XMixture {
		return new XMixture();
	}

	public createXFigure(): XFigure {
		return new XFigure();
	}

	public createXVariable(): XVariable {
		return new XVariable();
	}

	public createXIngestion(): XIngestion {
		return new XIngestion();
	}

	public createXMutation(): XMutation {
		return new XMutation();
	}

	public createXOption(): XOption {
		return new XOption();
	}

	public createXTabular(): XTabular {
		return new XTabular();
	}

	public createXPreparation(): XPreparation {
		return new XPreparation();
	}

	public createPointerField(): PointerField {
		return new PointerField();
	}

	public createXProjectFromJson(json: any): XProject {
		let ePackage = PadangPackage.eINSTANCE;
		return <XProject>builder.createEObject(json, ePackage);
	}

}

PadangFactory.eINSTANCE = new BasicPadangFactory();

