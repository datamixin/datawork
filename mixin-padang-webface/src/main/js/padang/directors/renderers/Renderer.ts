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
import Panel from "webface/wef/Panel";
import Conductor from "webface/wef/Conductor";
import Controller from "webface/wef/Controller";

import Action from "webface/action/Action";

import PointerField from "padang/model/PointerField";

import GraphicPremise from "padang/ui/GraphicPremise";
import PreformPartViewer from "padang/ui/PreformPartViewer";

import GraphicWizardDialog from "padang/dialogs/GraphicWizardDialog";

export abstract class Renderer {

	public static ROUTINE = "routine";
	public static VISUALIZATION = "visualization";

	public abstract createPresentPanel(conductor: Conductor, premise: GraphicPremise): Panel;

	public abstract createPartViewer(mapping: GraphicPremise): PreformPartViewer;

	public abstract getPointerFieldActionList(controller: Controller,
		field: PointerField, callback: (list: Action[]) => void): void;

	public abstract createWizard(controller: Controller, premise: GraphicPremise): GraphicWizardDialog;

	public abstract createWizardWithDataset(controller: Controller, dataset: string,
		premise: GraphicPremise): GraphicWizardDialog;

}

export default Renderer;