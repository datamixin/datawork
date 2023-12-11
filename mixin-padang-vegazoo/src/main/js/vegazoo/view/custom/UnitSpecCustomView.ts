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
import ObjectDefCustomView from "vegazoo/view/custom/ObjectDefCustomView";
import CustomNameTextPanel from "vegazoo/view/custom/CustomNameTextPanel";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";

import UnitSpecTitleSetRequest from "vegazoo/requests/custom/UnitSpecTitleSetRequest";

export default class UnitSpecCustomView extends ObjectDefCustomView {

    private titlePanel = new CustomNameTextPanel("Title");

    protected addContentPanels(panel: CustomCompositePanel): void {
        this.createTitlePanel(panel);
    }

    private createTitlePanel(panel: CustomCompositePanel): void {
        panel.addPanel(this.titlePanel);
        this.titlePanel.onCommit((newText: string, oldText: string) => {
            let request = new UnitSpecTitleSetRequest(newText);
            this.conductor.submit(request);
        });
    }

    public setTitle(title: string): void {
        this.titlePanel.setValue(title);
    }

}
