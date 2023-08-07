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
import CustomNameNumberPanel from "vegazoo/view/custom/CustomNameNumberPanel";

import AxisLabelAngleSetRequest from "vegazoo/requests/custom/AxisLabelAngleSetRequest";

export default class AxisCustomView extends ObjectDefCustomView {

    private labelAnglePanel = new CustomNameNumberPanel("Label Angle");

    protected addContentPanels(panel: CustomCompositePanel): void {
        this.createLabelAnglePanel(panel);
    }

    private createLabelAnglePanel(panel: CustomCompositePanel): void {

        panel.addPanel(this.labelAnglePanel);

        this.labelAnglePanel.onCommit((oldNumber: number, newNumber: number) => {
            if (oldNumber !== newNumber) {
                let request = new AxisLabelAngleSetRequest(newNumber);
                this.conductor.submit(request);
            }
        });

    }

    public setLabelAngle(labelAngle: number): void {
        this.labelAnglePanel.setValue(labelAngle);
    }

}
