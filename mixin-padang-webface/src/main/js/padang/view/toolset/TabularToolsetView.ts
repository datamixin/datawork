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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import LiteralFormula from "bekasi/LiteralFormula";

import * as view from "padang/view/view";

import NumberFormatDialog from "padang/dialogs/NumberFormatDialog";
import FunctionEditorDialog from "padang/dialogs/FormulaEditorDialog";

import ToolboxIconPanel from "padang/view/toolbox/ToolboxIconPanel";
import GroupToolbarPanel from "padang/view/toolbox/GroupToolbarPanel";

import DisplayToolsetView from "padang/view/toolset/DisplayToolsetView";

import TabularColumnFormatGetRequest from "padang/requests/TabularColumnFormatGetRequest";

import TabularExportResultRequest from "padang/requests/toolset/TabularExportResultRequest";
import TabularRefreshResultRequest from "padang/requests/toolset/TabularRefreshResultRequest";
import InputListComposerOpenRequest from "padang/requests/toolset/InputListComposerOpenRequest";
import TabularGenerateFormulaRequest from "padang/requests/toolset/TabularGenerateFormulaRequest";
import TabularColumnFormatSetRequest from "padang/requests/toolset/TabularColumnFormatSetRequest";
import TabularExportFormatListRequest from "padang/requests/toolset/TabularExportFormatListRequest";

export default class TabularToolsetView extends DisplayToolsetView {

	private composite: Composite = null;

	private inputsToolbarPanel: GroupToolbarPanel = null;

	private formatToolbarPanel: GroupToolbarPanel = null;
	private formatNumberPanel: ToolboxIconPanel = null;

	private exportToolbarPanel: GroupToolbarPanel = null;

	private dataset: boolean = true;
	private selectedColumn: string = null;

	constructor(conductor: Conductor, dataset: boolean) {
		super(conductor);
		this.dataset = dataset;
	}

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "padang-tabular-toolset-view");
		view.setGridLayout(this.composite, 4, 0, 0);

		this.createInputsToolbarPanel(this.composite);
		this.createFormatToolbarPanel(this.composite);
		if (this.dataset) {
			this.createExportToolbarPanel(this.composite);
		}

	}

	private createInputsToolbarPanel(parent: Composite): void {
		this.inputsToolbarPanel = new GroupToolbarPanel(this.conductor, "Inputs");
		this.inputsToolbarPanel.createControl(parent);
		view.setGridData(this.inputsToolbarPanel, 0, true);
		this.createInputsDialogIcon(this.inputsToolbarPanel);
		this.createInputRefreshIcon(this.inputsToolbarPanel);
	}

	private createInputsDialogIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-variable", "Input List Composer Dialog", () => {
			let request = new InputListComposerOpenRequest();
			this.conductor.submit(request);
		});
	}

	private createInputRefreshIcon(parent: GroupToolbarPanel): void {
		parent.createIcon("mdi-table-refresh", "Refresh Result", () => {
			let request = new TabularRefreshResultRequest();
			this.conductor.submit(request);
		});

	}

	private createFormatToolbarPanel(parent: Composite): void {
		this.formatToolbarPanel = new GroupToolbarPanel(this.conductor, "Format");
		this.formatToolbarPanel.createControl(parent);
		view.setGridData(this.formatToolbarPanel, 0, true);
		this.createFormatNumberIcon(this.formatToolbarPanel);
	}

	private createFormatNumberIcon(parent: GroupToolbarPanel): void {
		this.formatNumberPanel = parent.createIcon("mdi-decimal", "Format number or date", () => {
			let request = new TabularColumnFormatGetRequest(this.selectedColumn);
			this.conductor.submit(request, (format: string) => {
				let dialog = new NumberFormatDialog(format);
				dialog.open((result: string) => {
					if (result === NumberFormatDialog.OK) {
						let format = dialog.getFormat();
						let request = new TabularColumnFormatSetRequest(this.selectedColumn, format);
						this.conductor.submit(request);
					}
				});
			});
		});
	}

	private createExportToolbarPanel(parent: Composite): void {
		this.exportToolbarPanel = new GroupToolbarPanel(this.conductor, "Export");
		this.exportToolbarPanel.createControl(parent);
		view.setGridData(this.exportToolbarPanel, 0, true);
		this.createGenerateFormulaIcon();
		this.createExportResultIcon();
	}

	private createGenerateFormulaIcon(): void {
		this.exportToolbarPanel.createIcon("mdi-script-text-outline", "Generate Formula", () => {
			let request = new TabularGenerateFormulaRequest();
			this.conductor.submit(request, (literal: string) => {
				let formula = new LiteralFormula(literal);
				let dialog = new FunctionEditorDialog(this.conductor, formula);
				dialog.open(() => { });
			});
		});
	}

	private createExportResultIcon(): void {
		this.exportToolbarPanel.createIcon("mdi-cloud-download-outline", "Download Result", () => {
			let request = new TabularExportFormatListRequest();
			this.conductor.submit(request, (formats: { [name: string]: string }) => {
				let keys = Object.keys(formats);
				if (keys.length > 0) {
					let key = keys[0];
					let request = new TabularExportResultRequest(key);
					this.conductor.submit(request);
				}
			});
		});
	}

	public setSelectedColumn(column: string): void {
		this.formatNumberPanel.setEnabled(column !== null);
		this.selectedColumn = column;
	}

	public relayout(): void {
		this.adjustWidth();
	}

	public adjustWidth(): number {
		let part = new GridCompositeAdjuster(this.composite);
		return part.adjustWidth();
	}

	public getControl(): Control {
		return this.composite;
	}

}
