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
import EFactory from "webface/model/EFactory";

import XCell from "padang/model/XCell";
import XInput from "padang/model/XInput";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XOption from "padang/model/XOption";
import XBuilder from "padang/model/XBuilder";
import XOutlook from "padang/model/XOutlook";
import XGraphic from "padang/model/XGraphic";
import XOutcome from "padang/model/XOutcome";
import XDataset from "padang/model/XDataset";
import XViewset from "padang/model/XViewset";
import XMixture from "padang/model/XMixture";
import XProject from "padang/model/XProject";
import XTabular from "padang/model/XTabular";
import XMutation from "padang/model/XMutation";
import XVariable from "padang/model/XVariable";
import XIngestion from "padang/model/XIngestion";
import XPreparation from "padang/model/XPreparation";

import PointerField from "padang/model/PointerField";

export abstract class PadangFactory implements EFactory {

	public static eINSTANCE: PadangFactory = null;

	abstract create(xClass: EClass): EObject;

	abstract createXCell(): XCell;

	abstract createXInput(): XInput;

	abstract createXSheet(): XSheet;

	abstract createXOption(): XOption;

	abstract createXGraphic(): XGraphic;

	abstract createXOutcome(): XOutcome;

	abstract createXProject(): XProject;

	abstract createXDataset(): XDataset;

	abstract createXViewset(): XViewset;

	abstract createXOutlook(): XOutlook;

	abstract createXBuilder(): XBuilder;

	abstract createXMixture(): XMixture;

	abstract createXTabular(): XTabular;

	abstract createXFigure(): XFigure;

	abstract createXMutation(): XMutation;

	abstract createXVariable(): XVariable;

	abstract createXIngestion(): XIngestion;

	abstract createXPreparation(): XPreparation;

	abstract createPointerField(): PointerField;

	abstract createXProjectFromJson(json: any): XProject;

}

export default PadangFactory;
