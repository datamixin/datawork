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
import PartViewer from "webface/wef/PartViewer";

import XMutation from "padang/model/XMutation";
import PadangCreator from "padang/model/PadangCreator";

import InteractionPlan from "padang/plan/InteractionPlan";

import DatasetProjectHomeMenu from "padang/ui/DatasetProjectHomeMenu";

export default class StarterProjectHomeMenu extends DatasetProjectHomeMenu {

	private plan: InteractionPlan = null;

	constructor(viewer: PartViewer, args: any[]) {
		super(viewer);
		this.plan = <InteractionPlan>args[0];
	}

	public getLabel(): string {
		return this.plan.getLabel();
	}

	public getIcon(): string {
		return this.plan.getImage();
	}

	public getDescription(): string {
		return this.plan.getDescription();
	}

	protected createMutation(callback: (mutation: XMutation) => void): void {
		let creator = PadangCreator.eINSTANCE;
		let name = this.plan.getName();
		let mutation = creator.createStarterMutation(name);
		callback(mutation);
	}

}
