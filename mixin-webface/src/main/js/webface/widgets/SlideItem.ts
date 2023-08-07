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
import SlideTree from "webface/widgets/SlideTree";

export default class SlideItem {

    private text: string;
    private pane: JQuery;
    private control: Control;
    private tree: SlideTree;

    constructor(tree: SlideTree) {
        this.tree = tree;
        tree.addItem(this);
    }

    public getTree(): SlideTree {
        return this.tree;
    }

    public setSlideElement(pane: JQuery): void {
        this.pane = pane;
    }

    public getElement(): JQuery {
        return this.pane;
    }

    public setText(text: string): void {
        this.text = text;
        let selection = this.tree.getSelection();
        if (selection === this) {
            this.tree.setText(this.text);
        }
    }

    public getText(): string {
        return this.text;
    }

    public setControl(control: Control): void {

        this.pane.empty();

        let element = control.getElement();
        element.css("position", "absolute");
        this.pane.append(element);

        this.control = control;
    }

    public getControl(): Control {
        return this.control;
    }

}
