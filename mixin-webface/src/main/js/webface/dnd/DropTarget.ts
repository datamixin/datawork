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
import Widget from "webface/widgets/Widget";

export default class DropTarget {

    // Default options
    private options: JQueryUI.DroppableOptions = {
        tolerance: "pointer",
        greedy: true
    };

    public drop(drop: (event: any, ui: any) => void): void {
        this.options.drop = drop;
    }

    public applyTo(target: JQuery | Widget): void {
        let element: JQuery = null;
        if (target instanceof Widget) {
            element = (<Widget>target).getElement();
        } else {
            element = <JQuery>target;
        }
        element.droppable(this.options);
    }

}
