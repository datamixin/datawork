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
import ObjectDefCustomView from "vegazoo/view/custom/ObjectDefCustomView";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";
import CustomNameSwitchPanel from "vegazoo/view/custom/CustomNameSwitchPanel";

import ScaleZeroSetRequest from "vegazoo/requests/custom/ScaleZeroSetRequest";

export default class ScaleCustomView extends ObjectDefCustomView {

    private zeroPanel = new CustomNameSwitchPanel("Zero");

    protected addContentPanels(panel: CustomCompositePanel): void {
        this.createZeroPanel(panel);
    }

    private createZeroPanel(panel: CustomCompositePanel): void {
        panel.addPanel(this.zeroPanel);
        this.zeroPanel.onSelection((state: boolean) => {
            let request = new ScaleZeroSetRequest(state);
            this.conductor.submit(request);
        });

    }

    public setZero(zero: boolean): void {
        this.zeroPanel.setValue(zero);
    }

}
