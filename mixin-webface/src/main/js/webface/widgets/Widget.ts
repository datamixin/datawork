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
import Event from "webface/widgets/Event";
import Listener from "webface/widgets/Listener";
import TypedListener from "webface/widgets/TypedListener";

export default class Widget {

    protected element: JQuery;
    private listeners: EventTypeListener[] = [];

    public constructor(element: JQuery) {
        this.element = element;
    }

    public getElement(): JQuery {
        return this.element;
    }

    protected sendEvent(eventType: number, eventObject?: JQueryEventObject, data?: any): void {
        let event = new Event();
        event.widget = this;
        event.type = eventType;
        event.eventObject = eventObject;
        event.data = data;
        this.notifyListeners(eventType, event);
    }

    public notifyListeners(eventType: number, event?: Event) {
        if (!event) event = new Event();
        event.widget = this;
        event.type = eventType;
        for (var i = 0; i < this.listeners.length; i++) {
            let eventTypeListener = this.listeners[i];
            if (eventTypeListener.eventType === eventType) {
                let listener = eventTypeListener.listener;
                listener.handleEvent(event);
            }
        }
    }

    public addListener(eventType: number, listener: Listener) {
        this.listeners.push({ eventType: eventType, listener: listener });
    }

    public removeListener(eventType: number, listener: Listener) {
        for (var i = 0; i < this.listeners.length; i++) {
            let current = this.listeners[i];
            if (current.eventType === eventType) {
                if (current.listener === listener) {
                    this.listeners.slice(i, 1);
                    break;
                } else {
                    if (current.listener instanceof TypedListener
                        && listener instanceof TypedListener) {
                        if ((<TypedListener>current.listener).getEventListener() ===
                            (<TypedListener>listener).getEventListener()) {
                            this.listeners.slice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
    }

    public dispose(): void {

        // Remove element dari DOM
        this.element.remove();

    }

}

class EventTypeListener {

    public eventType: number;
    public listener: Listener;
}

