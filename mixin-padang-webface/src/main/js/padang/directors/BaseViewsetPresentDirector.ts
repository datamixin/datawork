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
import Command from "webface/wef/Command";
import * as functions from "webface/wef/functions";
import CommandGroup from "webface/wef/CommandGroup";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import RemoveCommand from "webface/wef/base/RemoveCommand";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import XCell from "padang/model/XCell";
import XFacet from "padang/model/XFacet";
import XSheet from "padang/model/XSheet";
import XFigure from "padang/model/XFigure";
import XOutcome from "padang/model/XOutcome";
import XMixture from "padang/model/XMixture";
import XViewset from "padang/model/XViewset";
import XVariable from "padang/model/XVariable";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import ViewsetPresentDirector from "padang/directors/ViewsetPresentDirector";

import MixtureWeightsSetCommand from "padang/commands/MixtureWeightsSetCommand";
import ViewsetSelectionSetCommand from "padang/commands/ViewsetSelectionSetCommand";

import MixturePresentController from "padang/controller/present/MixturePresentController";
import ViewsetPresentController from "padang/controller/present/ViewsetPresentController";

export default class BaseViewsetPresentDirector implements ViewsetPresentDirector {

	private viewer: BaseControllerViewer = null;

	constructor(viewer: BaseControllerViewer) {
		this.viewer = viewer;
	}

	private getViewsetController(): ViewsetPresentController {
		let rootController = this.viewer.getRootController();
		let controller = functions.getFirstDescendantByModelClass(rootController, XViewset);
		return <ViewsetPresentController>controller;
	}

	private getCurrentViewset(): XViewset {
		let controller = this.getViewsetController();
		return <XViewset>controller.getModel();
	}

	public createCellAddCommand(mixture: XMixture, cell: XCell, position?: number): Command {

		let parts = mixture.getParts();
		let group = new CommandGroup();

		let addCommand = new ListAddCommand();
		addCommand.setList(parts);
		addCommand.setElement(cell);
		addCommand.setPosition(position === undefined ? -1 : position);
		group.add(addCommand);

		let weights = this.calculateNewWeights(mixture, position);
		let setCommand = new MixtureWeightsSetCommand();
		setCommand.setWeights(weights);
		setCommand.setMixture(mixture);
		group.add(setCommand);

		return group;

	}

	private calculateNewWeights(mixture: XMixture, position?: number): string {

		let weights = this.getMixtureWeights(mixture);
		let parts = weights.split(MixturePresentController.DELIMITER);

		let total = 0;
		let sizes: number[] = [];
		for (let part of parts) {
			let size = parseFloat(part);
			total += size;
			sizes.push(size);
		}

		for (let i = 0; i < sizes.length; i++) {
			sizes[i] = sizes[i] * (sizes.length / (sizes.length + 1));
		}

		let newSize = total / (sizes.length + 1);
		if (position === undefined) {
			sizes.push(newSize);
		} else {
			sizes.splice(position, 0, newSize);
		}

		return sizes.join(MixturePresentController.DELIMITER);
	}

	private getMixtureWeights(mixture: XMixture): string {
		let weights = mixture.getWeights();
		if (weights === null) {
			let parts = mixture.getParts();
			let sizes: number[] = [];
			for (let i = 0; i < parts.size; i++) {
				sizes.push(1);
			}
			weights = sizes.join(MixturePresentController.DELIMITER);
		}
		return weights;
	}

	public removeMixtureCommand(mixture: XMixture): Command {
		let command = new RemoveCommand();
		let container = mixture.eContainer();
		if (container instanceof XViewset) {
			let parent = container.eContainer();
			let grant = parent.eContainer();
			if (grant instanceof XSheet) {
				command.setModel(grant);
			} else {
				command.setModel(parent);
			}
		} else {
			command.setModel(mixture);
		}
		return command;
	}

	private createEmptySelectionCommand(): ViewsetSelectionSetCommand {
		let viewset = this.getCurrentViewset();
		let command = new ViewsetSelectionSetCommand();
		command.setViewset(viewset);
		return command;
	}

	public createSelectionSetCommand(ascentor: EObject, exclude?: XCell): ViewsetSelectionSetCommand {
		let command = this.createEmptySelectionCommand();
		let cells = <XCell[]>util.getDescendantsByModelClass(ascentor, XCell, true);
		let last: XCell = null;
		for (let cell of cells) {
			if (exclude === cell) {
				break;
			}
			last = cell;
		}
		if (last !== null) {
			let name = this.getCellName(last);
			command.setSelection(name);
		}
		return command;
	}

	private getCellName(cell: XCell): string {
		if (cell !== null) {
			let facet = cell.getFacet();
			if (facet instanceof XOutcome) {
				let variable = facet.getVariable();
				return variable.getName();
			} else if (facet instanceof XFigure) {
				return facet.getName();
			}
		}
		return null;
	}

	public removeCellCommand(cell: XCell, onmove: XCell[], reselection?: boolean): Command {

		// Command utama remove cell
		let removeCommand = new RemoveCommand();
		removeCommand.setModel(cell);

		let mixture = <XMixture>cell.eContainer();
		let parts = mixture.getParts();
		let position = parts.indexOf(cell);
		if (parts.size === 1) {

			// Remove mixture dengan anak yang sendiri
			onmove.push(cell);
			let removeCommand = this.removeMixtureCommand(mixture);
			let group = new CommandGroup([removeCommand]);
			if (reselection !== false) {
				let container = mixture.eContainer();
				let upperContainer = container.eContainer();
				let command = this.createSelectionSetCommand(upperContainer, cell);
				group.add(command);
			}
			return group;

		} else if (parts.size === 2) {

			// Jika nanti present tunggal naik sekali replace source
			onmove.push(cell);
			let soleIndex = position === 0 ? 1 : 0;
			let solePresent = parts.get(soleIndex);
			let container = mixture.eContainer();
			if (container instanceof XMixture) {

				// Pertama: remove cell
				let group = new CommandGroup();
				group.add(removeCommand);

				// Kumpulkan cell yang di relokasi
				let cells = <XCell[]>util.getDescendantsByModelClass(solePresent, XCell);
				for (let moved of cells) {
					onmove.push(moved);
				}

				// Selection set command
				if (reselection !== false) {
					let command = this.createSelectionSetCommand(solePresent, cell);
					group.add(command);
				}

				// Kedua: replace mixture dengan present di bawahnya
				let replaceCommand = new ReplaceCommand();
				replaceCommand.setModel(mixture);
				replaceCommand.setReplacement(solePresent);
				group.add(replaceCommand)
				return group;

			}

		}

		// Default remove command
		onmove.push(cell);
		let group = new CommandGroup();
		group.add(removeCommand);

		// Selection set command
		if (reselection !== false) {
			let command = this.createSelectionSetCommand(mixture, cell);
			group.add(command);
		}

		// Hitung weights baru
		let weights = this.getMixtureWeights(mixture);
		weights = this.adjustSizes(weights, position);

		// Command present weight
		let setCommand = new MixtureWeightsSetCommand();
		setCommand.setMixture(mixture);
		setCommand.setWeights(weights);
		group.add(setCommand);

		return group;

	}

	private adjustSizes(sizes: string, position: number): string {
		let numbers = sizes.split(MixturePresentController.DELIMITER);
		numbers.splice(position, 1);
		return numbers.join(MixturePresentController.DELIMITER);
	}

	public confirmOnmove(cells: XCell[], callback: () => void): void {
		let identifiers: string[] = [];
		for (let cell of cells) {
			let variables = <XVariable[]>util.getDescendantsByModelClass(cell, XVariable, true);
			for (let variable of variables) {
				let identifier = variable.getName();
				identifiers.push(identifier);
			}
		}
		let viewset = this.getCurrentViewset();
		let director = directors.getProjectComposerDirector(this.viewer);
		director.inspectValue(viewset, padang.INSPECT_ONMOVE, [identifiers], () => {
			callback();
		});
	}

	public validateOutletName(name: string, callback: (message: string) => void): void {
		let viewset = this.getCurrentViewset();
		let facets = util.getDescendantsByModelClass(viewset, XFacet);
		for (let facet of facets) {
			if (facet instanceof XFigure) {
				if (facet.getName() === name) {
					callback("Outlet '" + name + "' already exist as a figure");
				}
			} else if (facet instanceof XOutcome) {
				let variable = facet.getVariable();
				if (variable.getName() === name) {
					callback("Outlet '" + name + "' already exist as a variable");
				}
			}
		}
		let director = directors.getExpressionFormulaDirector(this.viewer);
		let message = director.validateName(name);
		callback(message);
	}

	public getSelectedCell(): XCell {
		let controller = this.getViewsetController();
		let viewset = controller.getModel();
		let selection = viewset.getSelection();
		return this.getCellByName(selection);
	}

	public getFocusedMixture(): XMixture {
		let current = this.getSelectedCell();
		if (current !== null) {
			return <XMixture>current.eContainer();
		} else {
			let cell = this.getFirstDescendantCell();
			return <XMixture>cell.eContainer();
		}
	}

	public getCellByName(cellName: string): XCell {

		if (cellName === null) {
			return null;
		}

		let viewset = this.getCurrentViewset();
		let cells = <XCell[]>util.getDescendantsByModelClass(viewset, XCell, true);
		for (let cell of cells) {
			let facet = cell.getFacet();
			if (facet instanceof XOutcome) {
				let variable = facet.getVariable();
				let name = variable.getName();
				if (name === cellName) {
					return cell;
				}
			} else if (facet instanceof XFigure) {
				let name = facet.getName();
				if (name === cellName) {
					return cell;
				}
			}
		}
		return null;
	}

	public getFirstDescendantCell(): XCell {
		let viewset = this.getCurrentViewset();
		let cells = <XCell[]>util.getDescendantsByModelClass(viewset, XCell, true);
		if (cells.length > 0) {
			return cells[0];
		}
		return null;
	}

}