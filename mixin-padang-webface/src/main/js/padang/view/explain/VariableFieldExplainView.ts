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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import * as view from "padang/view/view";

import * as anatomy from "padang/view/anatomy/anatomy";

import VariableExplainView from "padang/view/explain/VariableExplainView";
import ValueFieldExplainView from "padang/view/explain/ValueFieldExplainView";

export default class VariableFieldExplainView extends ValueFieldExplainView {

    private variablePart: Composite = null;

    public createHeaderControl(parent: Composite): void {
        this.variablePart = new Composite(parent);
        view.setGridLayout(this.variablePart, 1, 0, 0);
    }

    public adjustHeaderHeight(): number {
        return anatomy.ITEM_HEIGHT + 10;
    }

    public getHeaderControl(): Control {
        return this.variablePart;
    }

    public setType(type: string): void {
        let children = this.variablePart.getChildren();
        if (children.length > 0) {
            let panel = <VariableExplainView>children[0].getData();
            panel.setType(type);
        }
    }

	public addView(child: ConductorView, index: number): void {
		if (child instanceof VariableExplainView) {
			child.createControl(this.variablePart, index);
			view.setGridData(child, true, true);
			view.setControlData(child);
		} else {
			super.addView(child, index);
		}
	}

}
