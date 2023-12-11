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

import Renderer from "padang/directors/renderers/Renderer";
import RendererRegistry from "padang/directors/renderers/RendererRegistry";

import GraphicPremise from "padang/ui/GraphicPremise";
import PreformPartViewer from "padang/ui/PreformPartViewer";

import RoutinePanel from "rinjani/panels/RoutinePanel";

import RinjaniPartViewer from "rinjani/ui/RinjaniPartViewer";

import RoutineWizardDialog from "rinjani/dialogs/RoutineWizardDialog";
import RoutineWithDatasetWizardDialog from "rinjani/dialogs/RoutineWithDatasetWizardDialog";

export default class RinjaniRenderer extends Renderer {

	public createPresentPanel(conductor: Conductor, premise: GraphicPremise): Panel {
		return new RoutinePanel(conductor, premise);
	}

	public createPartViewer(premise: GraphicPremise): PreformPartViewer {
		return new RinjaniPartViewer(premise);
	}

	public getPointerFieldActionList(_controller: Controller, _field: PointerField,
		callback: (list: Action[]) => void): void {
		let actions: Action[] = [];
		callback(actions);
	}

	public createWizard(controller: Controller, premise: GraphicPremise): RoutineWizardDialog {
		let dialog = new RoutineWizardDialog(controller, premise);
		return dialog;
	}

	public createWizardWithDataset(controller: Controller, dataset: string,
		premise: GraphicPremise): RoutineWithDatasetWizardDialog {
		let dialog = new RoutineWithDatasetWizardDialog(controller, dataset, premise);
		return dialog;
	}

}

let factory = RendererRegistry.getInstance();
factory.register(Renderer.ROUTINE, new RinjaniRenderer());