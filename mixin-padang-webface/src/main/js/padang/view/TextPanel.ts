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
import Panel from "webface/wef/Panel";

import Text from "webface/widgets/Text";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

export default class TextPanel implements Panel {

    private text: Text = null;

    public createControl(parent: Composite, index?: number): void {

        this.text = new Text(parent);

        let element = this.text.getElement();
        element.css("line-height", "inhirent");
    }

    public setText(text: string): void {
        this.text.setText(text);
    }

    public getText(): string {
        return this.text.getText();
    }

    public setOnModify(callback: (text: string) => void) {
        this.text.onModify(callback);
    }

    public getControl(): Control {
        return this.text;
    }

}
