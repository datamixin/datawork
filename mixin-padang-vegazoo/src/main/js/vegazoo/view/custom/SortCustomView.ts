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

import BaseAction from "webface/wef/base/BaseAction";

import { SortOrder } from "vegazoo/constants";

import ValueDefCustomView from "vegazoo/view/custom/ValueDefCustomView";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";
import CustomNamePopupPanel from "vegazoo/view/custom/CustomNamePopupPanel";

import SortValueSetRequest from "vegazoo/requests/custom/SortValueSetRequest";

export default class SortCustomView extends ValueDefCustomView {

	private value: string = null;
	private valuePanel = new CustomNamePopupPanel("Sort");

	protected addContentPanels(panel: CustomCompositePanel): void {
		this.createValuePanel(panel);
	}

	private createValuePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.valuePanel);
	}

	public setEncodings(encodings: string[]): void {
		this.valuePanel.setActions((): BaseAction[] => {

			let actions: BaseAction[] = [];

			let keys = Object.keys(SortOrder);
			for (let key of keys) {
				let sortOrder = SortOrder[key];
				if (this.value !== sortOrder) {
					let label = this.getSortOrderLabel(sortOrder);
					let action = new SortValueSetAction(this.conductor, sortOrder, label);
					actions.push(action);
				}
			}

			for (let encoding of encodings) {
				let value = encoding;
				if (this.value !== value) {
					let label = this.getEncodingOrderLabel(encoding);
					let action = new SortValueSetAction(this.conductor, value, label);
					actions.push(action);
				}
			}

			for (let encoding of encodings) {
				let value = "-" + encoding;
				if (this.value !== value) {
					let label = this.getEncodingOrderLabel(value);
					let action = new SortValueSetAction(this.conductor, value, label);
					actions.push(action);
				}
			}

			return actions;
		});
	}

	private getSortOrderLabel(value: string): string {
		let first = value[0].toUpperCase();
		return first + value.slice(1);
	}

	private getEncodingOrderLabel(value: string): string {
		let first = value[0];
		if (first === "-") {
			let first = value[1].toUpperCase();
			return "By " + first + value.slice(2) + " Descending";
		} else {
			let first = value[0].toUpperCase();
			return "By " + first + value.slice(1) + " Ascending";
		}
	}

	public setValue(value: string): void {
		if (value !== null) {
			let label: string = value;
			let orders = Object.keys(SortOrder);
			if (orders.indexOf(label) !== -1) {
				label = this.getSortOrderLabel(value);
			} else {
				label = this.getEncodingOrderLabel(value);
			}
			this.valuePanel.setValue(label);
		}
		this.value = value;
	}

}

class SortValueSetAction extends BaseAction {

	private value: string = null;
	private label: string = null;

	constructor(conductor: Conductor, value: string, label: string) {
		super(conductor);
		this.value = value;
		this.label = label;
	}

	public getText(): string {
		return this.label;
	}

	public run(): void {
		let request = new SortValueSetRequest(this.value);
		this.conductor.submit(request);
	}

}
