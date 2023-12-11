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
import Listener from "webface/widgets/Listener";
import EventListener from "webface/widgets/EventListener";

import ModifyEvent from "webface/events/ModifyEvent";
import ModifyListener from "webface/events/ModifyListener";
import SelectionEvent from "webface/events/SelectionEvent";
import SelectionListener from "webface/events/SelectionListener";

export default class TypedListener implements Listener {

    private eventListener: EventListener;

    constructor(listener: EventListener) {
        this.eventListener = listener;
    }

    public handleEvent(event: Event) {
        switch (event.type) {
            case webface.Selection: {
                let evt = new SelectionEvent(event);
                (<SelectionListener>this.eventListener).widgetSelected(evt);
                break;
            }
            case webface.Modify: {
                let evt = new ModifyEvent(event);
                (<ModifyListener>this.eventListener).modifyText(evt);
                break;
            }
        }
    }

    public getEventListener(): EventListener {
        return this.eventListener;
    }
}
