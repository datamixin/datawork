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
import * as webface from "webface/webface";

import Event from "webface/widgets/Event";
import ToolBar from "webface/widgets/ToolBar";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import ToolItem from "webface/widgets/ToolItem";
import Composite from "webface/widgets/Composite";

import Action from "webface/action/Action";
import PopupAction from "webface/action/PopupAction";

export default class ActionManager {

    private toolBar: ToolBar = null;
    private actions: Action[] = [];

    public createControl(parent: Composite): void {
        this.toolBar = new ToolBar(parent);
    }

    public getControl(): Control {
        return this.toolBar;
    }

    public addAction(action: Action, index?: number): ToolItem {
        let text = action.getText();
        let image = action.getImage();
        let item = new ToolItem(this.toolBar, index);
        if (image) {
            item.setImage(image, text);
        } else {
            item.setText(text);
        }
        item.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                if (action instanceof PopupAction) {
                    let popup = <PopupAction>action;
                    popup.open(event);
                } else {
                    action.run();
                }
            }
        });
        this.actions.push(action);
        return item;
    }

    public getActions(): Action[] {
        return this.actions;
    }
}
