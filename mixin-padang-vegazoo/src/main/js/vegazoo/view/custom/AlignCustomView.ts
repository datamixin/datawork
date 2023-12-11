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
import { Align } from "vegazoo/constants";

import ValueDefCustomView from "vegazoo/view/custom/ValueDefCustomView";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";
import CustomNameDialogPanel from "vegazoo/view/custom/CustomNameDialogPanel";

import AlignValueSetRequest from "vegazoo/requests/custom/AlignValueSetRequest";

export default class AlignCustomView extends ValueDefCustomView {

	private value: string = null;
	private valuePanel = new CustomNameDialogPanel("Time Unit");

	protected addContentPanels(panel: CustomCompositePanel): void {
		this.createValuePanel(panel);
	}

	private createValuePanel(panel: CustomCompositePanel): void {

		panel.addPanel(this.valuePanel);

		this.valuePanel.setButtonText("...");
		this.valuePanel.setInputCallback((callback: (list: string[]) => void) => {
			let values: string[] = [];
			let keys = Object.keys(Align);
			for (let key of keys) {
				let align = Align[key];
				if (this.value !== align) {
					values.push(align);
				}
			}
			callback(values);
		});

		this.valuePanel.setLabelCallback((label: string) => {
			let request = new AlignValueSetRequest(label);
			this.conductor.submit(request);
		});
	}

	public setValue(value: string): void {
		this.valuePanel.setValue(value);
		this.value = value;
	}

}
