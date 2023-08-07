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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";

import VisageType from "bekasi/visage/VisageType";
import VisageError from "bekasi/visage/VisageError";
import VisageValue from "bekasi/visage/VisageValue";

import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";

import PropaneMenuSet from "padang/view/present/propane/PropaneMenuSet";

import TabularColumnProperties from "padang/view/present/TabularColumnProperties";
import TabularColumnProfilePanel from "padang/view/present/TabularColumnProfilePanel";

export default class TabularColumnHeaderPanel extends ConductorPanel implements GridColumnLabelPanel {

	private static ERROR_HEIGHT = 18;

	private menuSet: PropaneMenuSet = null;
	private composite: Composite = null;
	private contentPart: Composite = null;
	private errorLabel: Label = null;
	private profileValue: VisageValue = null;
	private profilePart: Composite = null;
	private profilePanel: TabularColumnProfilePanel = null;

	constructor(conductor: Conductor, menuSet: PropaneMenuSet) {
		super(conductor);
		this.menuSet = menuSet;
	}

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.css(this.composite, "background", "#FFF");
		view.setGridLayout(this.composite, 1, 5, 5, 0, 0);
		view.setGridData(this.composite, true, true);

		this.createErrorLabel(this.composite);
		this.createContentPart(this.composite);
	}

	private createContentPart(parent: Composite): void {

		this.contentPart = new Composite(parent);
		view.setAbsoluteLayout(this.contentPart);
		view.setGridData(this.contentPart, true, true);

		this.createProfilePart(this.contentPart);

	}

	private createErrorLabel(parent: Composite): void {
		this.errorLabel = new Label(parent);
		view.css(this.errorLabel, "color", "#C44");
		view.css(this.errorLabel, "font-style", "italic");
		view.css(this.errorLabel, "line-height", TabularColumnHeaderPanel.ERROR_HEIGHT + "px");
		view.setGridData(this.errorLabel, true, 0);
	}

	private createProfilePart(parent: Composite): void {
		this.profilePart = new Composite(parent);
		view.addClass(this.profilePart, "padang-tabular-column-content-panel-profile-part");
		view.setGridLayout(this.profilePart, 1, 0, 0, 0, 0);
		view.setAbsoluteData(this.profilePart, 0, 0, "100%", "100%");
	}

	public setLabel(label: DefaultColumnLabel): void {
		if (this.profilePanel !== null) {
			view.dispose(this.profilePanel);
		}
		let name = label.getLabel();
		let type = label.getType();
		if (VisageType.isTemporal(type)) {
			type = VisageType.DATETIME;
		}
		this.profilePanel = new TabularColumnProfilePanel(this.conductor, name, type);
		this.profilePanel.createControl(this.profilePart);
		this.profilePanel.setMenuSet(this.menuSet);
		let control = this.profilePanel.getControl();
		view.setGridData(control, true, true);
	}

	public setProperty(name: string, value: any): void {

		if (name === TabularColumnProperties.INITIAL_PROFILE) {

			this.profileValue = value;
			this.setShowError(value instanceof VisageError);

			if (value instanceof VisageError) {
				let message = value.getMessage();
				this.errorLabel.setText("Error: " + message);
			} else {
				this.profilePanel.setInitialProfile(value);
				this.profilePanel.populateFigure();
				this.profilePanel.relayout();
			}

		} else {

			if (!(this.profileValue instanceof VisageError)) {

				if (name === TabularColumnProperties.FORMAT) {

					this.profilePanel.setFormat(value);

				} else if (name === TabularColumnProperties.INSPECT_PROFILE) {

					this.profilePanel.inspectProfile(value);

				} else if (name === TabularColumnProperties.INSPECT_SELECTIONS) {

					this.profilePanel.selectValues(<Map<string, any>>value);

				}

			}
		}

	}

	private setShowError(state: boolean): void {
		view.setGridData(this.errorLabel, true, state ? TabularColumnHeaderPanel.ERROR_HEIGHT : 0);
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}
