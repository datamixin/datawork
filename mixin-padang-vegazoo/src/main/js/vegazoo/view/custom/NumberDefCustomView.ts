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
import ValueDefCustomView from "vegazoo/view/custom/ValueDefCustomView";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";
import CustomNameNumberPanel from "vegazoo/view/custom/CustomNameNumberPanel";

import NumberDefValueSetRequest from "vegazoo/requests/custom/NumberDefValueSetRequest";

export default class NumberDefCustomView extends ValueDefCustomView {

	private valuePanel = new CustomNameNumberPanel("Value");

	protected addContentPanels(panel: CustomCompositePanel): void {
		this.createValuePanel(panel);
	}

	private createValuePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.valuePanel);
		this.valuePanel.onCommit((oldNumber: number, newNumber: number) => {
			if (oldNumber !== newNumber) {
				let request = new NumberDefValueSetRequest(newNumber);
				this.conductor.submit(request);
			}
		});
	}

	public setValue(labelAngle: number): void {
		this.valuePanel.setValue(labelAngle);
	}

}
