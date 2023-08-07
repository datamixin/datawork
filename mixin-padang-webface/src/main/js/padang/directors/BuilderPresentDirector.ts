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
export let BUILDER_PRESENT_DIRECTOR = "builder-present-director";

import Panel from "webface/wef/Panel";
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XBuilder from "padang/model/XBuilder";

import ValueMapping from "padang/util/ValueMapping";

import BuilderWizardDialog from "padang/dialogs/BuilderWizardDialog";

import BuilderPresentController from "padang/controller/present/BuilderPresentController";

export interface BuilderPresentDirector {

	addBuilderCompose(controller: Controller, structure: string, dataset: string): void;

	openBuilderComposerFrom(descendant: Controller, callback: () => void): void;

	refreshBuilder(descendant: Controller): void;

	applyBuilder(builder: XBuilder, mapping: ValueMapping): void;

	openBuilderComposer(builder: XBuilder, mapping: ValueMapping, callback: (ok: boolean) => void): void;

	updateVariables(controller: BuilderPresentController, mapping: ValueMapping): void;

	createPresentPanel(controller: BuilderPresentController): Panel;

	createTryoutPanel(controller: BuilderPresentController, mapping?: ValueMapping): Panel;

	createWizard(controller: Controller, structure: string,
		dataset: string, callback: (dialog: BuilderWizardDialog) => void): void;

	createWizardWithDataset(controller: Controller, structure: string,
		dataset: string, callback: (dialog: BuilderWizardDialog) => void): void;

}

export function getBuilderPresentDirector(host: Controller | PartViewer): BuilderPresentDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <BuilderPresentDirector>viewer.getDirector(BUILDER_PRESENT_DIRECTOR);
}

export default BuilderPresentDirector;
