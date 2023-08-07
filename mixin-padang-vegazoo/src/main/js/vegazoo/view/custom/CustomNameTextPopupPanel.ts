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
import Action from "webface/action/Action";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import TextPopupPanel from "webface/ui/TextPopupPanel";

import CustomNameBasePanel from "vegazoo/view/custom/CustomNameBasePanel";

export default class CustomNameTextPopupPanel extends CustomNameBasePanel {

    public static HEIGHT = 24;
    public static NAME_WIDTH = 100;

    private panel: TextPopupPanel = null;
    private onChanged = (option: string) => { };
    private actions: () => Action[] = () => { return [] };

    protected createValueControl(parent: Composite): void {

        this.panel = new TextPopupPanel();
        this.panel.createControl(parent);

        let control = this.panel.getLabelControl();
        let element = control.getElement();
        element.css("line-height", (CustomNameTextPopupPanel.HEIGHT - 2) + "px");
        element.css("background-color", "#FFF");

        this.panel.setPopupActions((callback: (actions: Action[]) => void) => {
            callback(this.actions());
        });
    }

    public setValue(value: string): void {
        this.panel.setText(value);
    }

    public setActions(actions: () => Action[]): void {
        this.actions = actions;
    }

    public setOptions(options: string[]): void {
        this.actions = () => {
            let actions: OptionAction[] = [];
            for (let option of options) {
                let action = new OptionAction(option, this.onChanged);
                actions.push(action);
            }
            return actions;
        }
    }

    public setOnChanged(callback: (text: string) => void): void {
        this.onChanged = callback;
        this.panel.setOnChanged(callback);
    }

    protected getValueControl(): Control {
        return this.panel.getControl();
    }

}

class OptionAction extends Action {

    private callback = (option: string) => { };

    constructor(option: string, callback: (option: string) => void) {
        super(option);
        this.callback = callback;
    }

    public run(): void {
        let text = this.getText();
        this.callback(text);
    }

}