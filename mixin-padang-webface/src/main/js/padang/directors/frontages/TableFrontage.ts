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

import VisageType from "bekasi/visage/VisageType";
import VisageValue from "bekasi/visage/VisageValue";
import VisageTable from "bekasi/visage/VisageTable";

import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";

import Frontage from "padang/directors/frontages/Frontage";
import FrontagePanel from "padang/view/present/FrontagePanel";
import FrontageRegistry from "padang/directors/frontages/FrontageRegistry";

import ToolsetAction from "padang/view/toolbox/ToolboxAction";

import MultikeyProperties from "padang/util/MultikeyProperties";

import NumberFormatDialog from "padang/dialogs/NumberFormatDialog";

import TableContentProvider from "padang/view/TableContentProvider";
import DefaultCellValuePanel from "padang/view/DefaultCellValuePanel";
import DefaultColumnLabelPanel from "padang/view/DefaultColumnLabelPanel";

import GridFrontagePanel from "padang/directors/frontages/GridFrontagePanel";
import TableColumnProperties from "padang/directors/frontages/TableColumnProperties";

import FacetPropertySetRequest from "padang/requests/FacetPropertySetRequest";

import OutcomeCreateFigureRequest from "padang/requests/present/OutcomeCreateFigureRequest";

export default class TableFrontage extends Frontage {

	public static FORMAT = "format";

	public createPresentPanel(conductor: Conductor, value: VisageValue): FrontagePanel {
		return new TableFrontagePanel(conductor, <VisageTable>value);
	}

	public createToolsetActions(conductor: Conductor, properties: MultikeyProperties): ToolsetAction[] {
		let actions: ToolsetAction[] = [];
		if (properties.hasKey([GridFrontagePanel.SELECTION])) {
			let selection = properties.getValue([GridFrontagePanel.SELECTION]);
			let label = selection[GridFrontagePanel.LABEL];
			if (label !== undefined) {
				actions.push(new ToolsetAction("Format", "mdi-decimal", "Format number or date", () => {
					let keys = [label, TableFrontage.FORMAT];
					let format = properties.getValue(keys);
					let dialog = new NumberFormatDialog(format);
					dialog.open((result: string) => {
						if (result === NumberFormatDialog.OK) {
							let format = dialog.getFormat();
							let request = new FacetPropertySetRequest(keys, format);
							conductor.submit(request);
						}
					});
				}));
			};
		}
		actions.push(new ToolsetAction("Add Visualization", "mdi-chart-box-plus-outline", "Add New Visualiation", () => {
			let request = new OutcomeCreateFigureRequest(OutcomeCreateFigureRequest.RENDERER_VISUALIZATION);
			conductor.submit(request);
		}));
		actions.push(new ToolsetAction("Add Routine", "mdi-layers-plus", "Add New Routine", () => {
			let request = new OutcomeCreateFigureRequest(OutcomeCreateFigureRequest.RENDERER_ROUTINE);
			conductor.submit(request);
		}));
		return actions;
	}

}

export class TableFrontagePanel extends GridFrontagePanel {

	private table: VisageTable = null;

	constructor(conductor: Conductor, value: VisageTable) {
		super(conductor, <GridControlStyle>{},
			new TableContentProvider(value),
			new TableLabelExtender(conductor));
		this.table = value;
	}

	protected generateFooter(): string {
		let rowCount = this.table.recordCount();
		let columns = this.table.getColumns();
		let columnCount = columns.length;
		let text = "";
		if (rowCount !== -1) {
			text += rowCount + " rows";
		}
		if (columnCount !== -1) {
			if (text.length > 0) {
				text += " ";
			}
			text += (columnCount - 1) + " columns";
		}
		return text;
	}

}

class TableLabelExtender implements GridLabelExtender {

	private conductor: Conductor = null;
	private properties: TableColumnProperties = null;

	constructor(conductor: Conductor) {
		this.conductor = conductor;
		this.properties = new TableColumnProperties(conductor);
	}

	public getColumnLabelPanel(): DefaultColumnLabelPanel {
		return new DefaultColumnLabelPanel(this.conductor);
	}

	public getColumnProperties(): TableColumnProperties {
		return this.properties;
	}

	public getCellValuePanel(): DefaultCellValuePanel {
		return new DefaultCellValuePanel(this.conductor);
	}

}

let registry = FrontageRegistry.getInstance();
let frontage = new TableFrontage();
registry.register(VisageType.MIXINTABLE, Frontage.DEFAULT, frontage);
registry.register(VisageTable.LEAN_NAME, Frontage.DEFAULT, frontage);
