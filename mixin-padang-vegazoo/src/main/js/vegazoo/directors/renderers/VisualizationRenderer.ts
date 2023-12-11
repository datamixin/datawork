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

import Renderer from "padang/directors/renderers/Renderer";
import RendererRegistry from "padang/directors/renderers/RendererRegistry";

import GraphicWizardDialog from "padang/dialogs/GraphicWizardDialog";

import EncodeAsAction from "vegazoo/actions/EncodeAsAction";

import VegazooPartViewer from "vegazoo/ui/VegazooPartViewer";

import VisualizationPanel from "vegazoo/panels/VisualizationPanel";

import VisualizationWizardDialog from "vegazoo/dialogs/VisualizationWizardDialog";

export default class VisualizationRenderer extends Renderer {

	public createPresentPanel(conductor: Conductor, premise: GraphicPremise): Panel {
		return new VisualizationPanel(conductor, premise);
	}

	public createPartViewer(premise: GraphicPremise): PreformPartViewer {
		return new VegazooPartViewer(premise);
	}

	public getPointerFieldActionList(controller: Controller,
		field: PointerField, callback: (list: Action[]) => void): void {
		let actions: Action[] = [];
		actions.push(new EncodeAsAction(controller, field));
		callback(actions);
	}

	public createWizard(controller: Controller, premise: GraphicPremise): VisualizationWizardDialog {
		return new VisualizationWizardDialog(controller, premise);
	}

	public createWizardWithDataset(controller: Controller, _dataset: string,
		premise: GraphicPremise): GraphicWizardDialog {
		return new VisualizationWizardDialog(controller, premise);
	}

}

let factory = RendererRegistry.getInstance();
factory.register(Renderer.VISUALIZATION, new VisualizationRenderer());