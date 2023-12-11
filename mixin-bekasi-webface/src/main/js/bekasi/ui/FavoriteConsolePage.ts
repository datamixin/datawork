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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridLayout from "webface/layout/GridLayout";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import ConsolePage from "bekasi/ui/ConsolePage";

export default class FavoriteConsolePage extends ConsolePage {

    private composite: Composite = null;

    constructor(rootViewer: BasePartViewer) {
        super(rootViewer, "favorites", "Favorites", "mdi-star");
    }

    public createControl(parent: Composite): void {

        this.composite = new Composite(parent);

        let element = this.composite.getElement();
        element.addClass("bekasi-favorite-console-page");

        let layout = new GridLayout(1, 0, 0);
        this.composite.setLayout(layout);

    }

    public getControl(): Control {
        return this.composite;
    }

}