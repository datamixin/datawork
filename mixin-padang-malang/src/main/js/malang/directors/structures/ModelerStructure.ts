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
import Panel from "webface/wef/Panel";
import Conductor from "webface/wef/Conductor";
import Controller from "webface/wef/Controller";

import Action from "webface/action/Action";

import PointerField from "padang/model/PointerField";

import BuilderPremise from "padang/ui/BuilderPremise";
import PreformPartViewer from "padang/ui/PreformPartViewer";

import Structure from "padang/directors/structures/Structure";
import StructureRegistry from "padang/directors/structures/StructureRegistry";

import MalangPartViewer from "malang/ui/MalangPartViewer";

import ModelerTryoutPanel from "malang/panels/ModelerTryoutPanel";
import ModelerPresentPanel from "malang/panels/ModelerPresentPanel";

import ModelerWizardDialog from "malang/dialogs/ModelerWizardDialog";
import ModelerWithDatasetWizardDialog from "malang/dialogs/ModelerWithDatasetWizardDialog";

export default class MalangStructure extends Structure {

	public createPresentPanel(conductor: Conductor, premise: BuilderPremise): Panel {
		return new ModelerPresentPanel(conductor, premise);
	}

	public createTryoutPanel(conductor: Conductor, premise: BuilderPremise): Panel {
		return new ModelerTryoutPanel(conductor, premise);
	}

	public createPartViewer(premise: BuilderPremise): PreformPartViewer {
		return new MalangPartViewer(premise);
	}

	public getPointerFieldActionList(_controller: Controller, _field: PointerField,
		callback: (list: Action[]) => void): void {
		let actions: Action[] = [];
		callback(actions);
	}

	public createWizard(controller: Controller, premise: BuilderPremise): ModelerWizardDialog {
		let dialog = new ModelerWizardDialog(controller, premise);
		return dialog;
	}

	public createWizardWithDataset(controller: Controller, dataset: string,
		premise: BuilderPremise): ModelerWithDatasetWizardDialog {
		let dialog = new ModelerWithDatasetWizardDialog(controller, dataset, premise);
		return dialog;
	}

}

let factory = StructureRegistry.getInstance();
factory.register(Structure.MODEL, new MalangStructure());