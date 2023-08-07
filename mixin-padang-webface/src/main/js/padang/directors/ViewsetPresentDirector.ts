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
export let VIEWSET_PRESENT_DIRECTOR = "viewset-present-director";

import Command from "webface/wef/Command";
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import EObject from "webface/model/EObject";

import XCell from "padang/model/XCell";
import XMixture from "padang/model/XMixture";

import ViewsetSelectionSetCommand from "padang/commands/ViewsetSelectionSetCommand";

export interface ViewsetPresentDirector {

	createCellAddCommand(mixture: XMixture, cell: XCell, position?: number): Command;

	removeMixtureCommand(mixture: XMixture): Command;

	removeCellCommand(cell: XCell, onmove: XCell[], reselection?: boolean): Command;

	confirmOnmove(cells: XCell[], callback: () => void): void;

	validateOutletName(name: string, callback: (message: string) => void): void;

	getCellByName(name: string): XCell;

	getSelectedCell(): XCell;

	getFocusedMixture(): XMixture;

	getFirstDescendantCell(): XCell;

	createSelectionSetCommand(ancestor: EObject, exclude?: XCell): ViewsetSelectionSetCommand;

}

export function getViewsetPresentDirector(host: Controller | PartViewer): ViewsetPresentDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ViewsetPresentDirector>viewer.getDirector(VIEWSET_PRESENT_DIRECTOR);
}

export default ViewsetPresentDirector;

