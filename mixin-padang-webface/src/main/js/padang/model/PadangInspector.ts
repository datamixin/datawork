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
import EList from "webface/model/EList";

import * as functions from "webface/util/functions";

import XCell from "padang/model/XCell";
import XPart from "padang/model/XPart";
import XInput from "padang/model/XInput";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XGraphic from "padang/model/XGraphic";
import XOutcome from "padang/model/XOutcome";
import XDataset from "padang/model/XDataset";
import XReceipt from "padang/model/XReceipt";
import XMixture from "padang/model/XMixture";
import XViewset from "padang/model/XViewset";
import XProject from "padang/model/XProject";
import XVariable from "padang/model/XVariable";

export default class PadangInspector {

	public static eINSTANCE: PadangInspector = null;

	public getSheetNames(container: EList<XSheet> | XProject): string[] {
		let sheets: EList<XSheet> = null;
		if (container instanceof XProject) {
			sheets = (<XProject>container).getSheets();
		} else {
			sheets = container;
		}
		let names: string[] = [];
		for (let i = 0; i < sheets.size; i++) {
			let item = sheets.get(i);
			let name = item.getName();
			names.push(name);
		}
		return names;
	}

	public getInputNames(container: EList<XInput> | XReceipt): string[] {
		let list: EList<XInput> = null;
		if (container instanceof XDataset) {
			list = container.getInputs();
		} else {
			list = <EList<XInput>>container;
		}
		let names: string[] = [];
		for (let i = 0; i < list.size; i++) {
			let input = list.get(i);
			let name = input.getName();
			names.push(name);
		}
		return names;
	}

	public getVariableNames(container: XGraphic | EList<XVariable>): string[] {
		let list: EList<XVariable> = null;
		if (container instanceof XGraphic) {
			list = container.getVariables();
		} else {
			list = <EList<XVariable>>container;
		}
		let names: string[] = [];
		for (let i = 0; i < list.size; i++) {
			let variable = list.get(i);
			let name = variable.getName();
			names.push(name);
		}
		return names;
	}

	public getPartNames(viewset: XViewset): string[] {
		let names: string[] = [];
		let mixture = viewset.getMixture();
		this.doGetPartNames(names, mixture);
		return names;
	}

	private doGetPartNames(names: string[], part: XPart): void {
		if (part instanceof XCell) {
			let facet = part.getFacet();
			if (facet instanceof XOutcome) {
				let variable = facet.getVariable();
				let name = variable.getName();
				names.push(name);
			} else if (facet instanceof XFigure) {
				let name = facet.getName();
				names.push(name);
			}
		} else if (part instanceof XMixture) {
			let parts = part.getParts();
			for (let nested of parts) {
				this.doGetPartNames(names, nested);
			}
		}
	}

	public getNewSheetName(name: string, project: XProject): string {
		let names = this.getSheetNames(project);
		let newName = functions.getIncrementedName(name, names);
		return newName;
	}

	public getSheet(sheets: EList<XSheet>, name: string): XSheet {
		for (let sheet of sheets) {
			if (sheet.getName() === name) {
				return sheet;
			}
		}
		return null;
	}

}


PadangInspector.eINSTANCE = new PadangInspector();
