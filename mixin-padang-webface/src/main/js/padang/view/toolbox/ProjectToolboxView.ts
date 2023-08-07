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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import LiteralFormula from "bekasi/LiteralFormula";

import * as view from "padang/view/view";

import DatasetAddRequest from "padang/requests/DatasetAddRequest";
import OutcomeAddRequest from "padang/requests/OutcomeAddRequest";

import FormulaEditorDialog from "padang/dialogs/FormulaEditorDialog";

import GroupToolbarPanel from "padang/view/toolbox/GroupToolbarPanel";

import FigureCreateRequest from "padang/requests/FigureCreateRequest";
import OutcomeCreateRequest from "padang/requests/OutcomeCreateRequest";
import OutcomeFormulaListRequest from "padang/requests/OutcomeFormulaListRequest";

import ProjectSaveRequest from "padang/requests/toolbox/ProjectSaveRequest";
import ProjectSaveAsRequest from "padang/requests/toolbox/ProjectSaveAsRequest";
import BuilderWizardDialogRequest from "padang/requests/toolbox/BuilderWizardDialogRequest";
import GraphicWizardDialogRequest from "padang/requests/toolbox/GraphicWizardDialogRequest";

import OutcomeFormulaSelectionDialog from "padang/dialogs/OutcomeFormulaSelectionDialog";

export default class ProjectToolboxView extends ConductorView {

	private composite: Composite = null;

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "padang-project-toolbox-view");
		view.setGridLayout(this.composite, 4, 0, 0);
		this.createFileGroupPanel(this.composite);
		this.createTaskGroupPanel(this.composite);
		this.createSheetGroupPanel(this.composite);
	}

	private createFileGroupPanel(parent: Composite): void {
		let panel = new GroupToolbarPanel(this.conductor, "File");
		panel.createControl(parent);
		view.setGridData(panel, 0, true);
		view.addClass(panel, "padang-project-toolbox-file-group-panel");
		this.createSaveIcon(panel);
		this.createSaveAsIcon(panel);
	}

	private createSaveIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-content-save", "Save Project", () => {
			let request = new ProjectSaveRequest();
			this.conductor.submit(request);
		});
	}

	private createSaveAsIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-content-save-settings", "Save Project As..", () => {
			let request = new ProjectSaveAsRequest();
			this.conductor.submit(request);
		});
	}

	private createTaskGroupPanel(parent: Composite): void {
		let panel = new GroupToolbarPanel(this.conductor, "Task");
		panel.createControl(parent);
		view.setGridData(panel, 0, true);
		view.addClass(panel, "padang-project-toolbox-task-group-panel");
		this.createGraphicWizardIcon(panel);
		this.createBuilderWizardIcon(panel);
	}

	private createGraphicWizardIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-image-auto-adjust", "Create New Graphic", () => {
			let request = new GraphicWizardDialogRequest();
			this.conductor.submit(request);
		});
	}

	private createBuilderWizardIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-bullseye-arrow", "Create New Model", () => {
			let request = new BuilderWizardDialogRequest();
			this.conductor.submit(request);
		});
	}

	private createSheetGroupPanel(parent: Composite): void {
		let panel = new GroupToolbarPanel(this.conductor, "Sheet");
		panel.createControl(parent);
		view.setGridData(panel, 0, true);
		view.addClass(panel, "padang-project-toolbox-sheet-group-panel");
		this.createDatasetAddIcon(panel);
		this.createOutcomeAddIcon(panel);
		this.createVisualizationAddIcon(panel);
		this.createRoutineAddIcon(panel);
	}

	private createDatasetAddIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-table-large-plus", "Create New Dataset", () => {
			let request = new DatasetAddRequest();
			this.conductor.submit(request);
		});
	}

	private createOutcomeAddIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-application-variable-outline", "Create New Outcome", () => {
			let request = new OutcomeAddRequest();
			this.conductor.submit(request, () => {
				let request = new OutcomeFormulaListRequest();
				this.conductor.submit(request, (names: Map<string, string>) => {
					let zero = "=0";
					if (names.size > 0) {
						let dialog = new OutcomeFormulaSelectionDialog(this.conductor);
						dialog.open((result: string) => {
							if (result === OutcomeFormulaSelectionDialog.OK) {
								let formula = dialog.getSelection();
								let request = new OutcomeCreateRequest(formula);
								this.conductor.submit(request);
							} else if (result === OutcomeFormulaSelectionDialog.EDIT) {
								let literal = dialog.getSelection();
								if (literal === null) {
									literal = zero;
								}
								this.openFormulaEditorDialog(literal);
							}
						});
					} else {
						this.openFormulaEditorDialog(zero);
					}
				});
			});
		});
	}

	private openFormulaEditorDialog(literal: string): void {
		let formula = new LiteralFormula(literal);
		let editor = new FormulaEditorDialog(this.conductor, formula);
		editor.open((result: string) => {
			if (result === FormulaEditorDialog.OK) {
				let formula = editor.getFormula();
				let request = new OutcomeCreateRequest(formula.literal);
				this.conductor.submit(request);
			}
		});
	}

	private createVisualizationAddIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-chart-areaspline", "Create New Visualization", () => {
			let request = new OutcomeAddRequest();
			this.conductor.submit(request, () => {
				let request = new FigureCreateRequest(FigureCreateRequest.RENDERER_VISUALIZATION);
				this.conductor.submit(request);
			});
		});
	}

	private createRoutineAddIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-application-cog-outline", "Create New Routine", () => {
			let request = new OutcomeAddRequest();
			this.conductor.submit(request, () => {
				let request = new FigureCreateRequest(FigureCreateRequest.RENDERER_ROUTINE);
				this.conductor.submit(request);
			});
		});
	}


	public setDatasetExists(_exists: boolean): void {

	}

	public relayout(): void {
		let part = new GridCompositeAdjuster(this.composite);
		part.adjustWidth();
	}

	public getControl(): Control {
		return this.composite;
	}

}
