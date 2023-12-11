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
export let GRAPHIC_PRESENT_DIRECTOR = "graphic-present-director";

import Panel from "webface/wef/Panel";
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XGraphic from "padang/model/XGraphic";

import ValueMapping from "padang/util/ValueMapping";

import GraphicWizardDialog from "padang/dialogs/GraphicWizardDialog";

import GraphicPresentController from "padang/controller/present/GraphicPresentController";

export interface GraphicPresentDirector {

	addGraphicCompose(controller: Controller, structure: string, dataset: string): void;

	openGraphicComposerFrom(descendant: Controller, callback: () => void): void;

	refreshGraphic(descendant: Controller): void;

	applyGraphic(graphic: XGraphic, mapping: ValueMapping): void;

	openGraphicComposer(graphic: XGraphic, mapping: ValueMapping, callback: (ok: boolean) => void): void;

	updateVariables(controller: GraphicPresentController, mapping: ValueMapping): void;

	createPresentPanel(controller: GraphicPresentController, mapping: ValueMapping): Panel;

	createWizard(controller: Controller, structure: string,
		dataset: string, callback: (dialog: GraphicWizardDialog) => void): void;

	createWizardWithDataset(controller: Controller, structure: string,
		dataset: string, callback: (dialog: GraphicWizardDialog) => void): void;

}

export function getGraphicPresentDirector(host: Controller | PartViewer): GraphicPresentDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <GraphicPresentDirector>viewer.getDirector(GRAPHIC_PRESENT_DIRECTOR);
}

export default GraphicPresentDirector;
