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
import CustomNameSwitchPanel from "vegazoo/view/custom/CustomNameSwitchPanel";

import BooleanDefValueSetRequest from "vegazoo/requests/custom/BooleanDefValueSetRequest";

export default class BooleanDefCustomView extends ValueDefCustomView {

	private valuePanel = new CustomNameSwitchPanel("Value");

	protected addContentPanels(panel: CustomCompositePanel): void {
		this.createValuePanel(panel);
	}

	private createValuePanel(panel: CustomCompositePanel): void {
		panel.addPanel(this.valuePanel);
		this.valuePanel.onSelection((state: boolean) => {
			let request = new BooleanDefValueSetRequest(state);
			this.conductor.submit(request);
		});
	}

	public setValue(value: boolean): void {
		this.valuePanel.setValue(value);
	}

}
