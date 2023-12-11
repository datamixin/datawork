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
import Panel from "webface/wef/Panel";

import Composite from "webface/widgets/Composite";

import FillLayout from "webface/layout/FillLayout";

export class ApplicationPanel {

    private panel: Panel = null;

    constructor(panel: Panel) {
        this.panel = panel;
    }

    public createControl(parent: JQuery): void {

        let composite = new Composite(parent);

        let element = composite.getElement();
        element.addClass("lawang-application-frame");

        let layout = new FillLayout();
        composite.setLayout(layout);
        this.panel.createControl(composite);

        // Relayout
        composite.pack();
        $(window).bind("resize", function() {
            composite.pack();
        });

    }

}

export default ApplicationPanel;
