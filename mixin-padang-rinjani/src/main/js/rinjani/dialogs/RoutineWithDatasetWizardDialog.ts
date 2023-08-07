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
import Conductor from "webface/wef/Conductor";

import Composite from "webface/widgets/Composite";

import GraphicPremise from "padang/ui/GraphicPremise";

import DatasetDialogPage from "padang/dialogs/DatasetDialogPage";

import RoutineWizardDialog from "rinjani/dialogs/RoutineWizardDialog";

export default class RoutineWithDatasetWizardDialog extends RoutineWizardDialog {

	private dataset: string = null;

	constructor(conductor: Conductor, dataset: string, premise: GraphicPremise) {
		super(conductor, premise);
		this.dataset = dataset;
	}

	protected addPages(parent: Composite): void {
		this.addPage(parent, new DatasetDialogPage(this, this.conductor, this.dataset));
		super.addPages(parent);
	}

}
