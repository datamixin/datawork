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
import Conductor from "webface/wef/Conductor";

import WizardDialog from "webface/dialogs/WizardDialog";

import GraphicPremise from "padang/ui/GraphicPremise";

export abstract class GraphicWizardDialog extends WizardDialog {

	protected conductor: Conductor = null;
	protected premise: GraphicPremise = null;

	constructor(conductor: Conductor, premise: GraphicPremise) {
		super();
		this.conductor = conductor;
		this.premise = premise;
	}

	public getPremise(): GraphicPremise {
		return this.premise;
	}

}

export default GraphicWizardDialog;