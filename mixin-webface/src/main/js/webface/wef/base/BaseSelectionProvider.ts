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
import Selection from "webface/viewers/Selection";
import SelectionProvider from "webface/viewers/SelectionProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

export default class BaseSelectionProvider implements SelectionProvider {

    private selection: any[] = [];
    private listeners: SelectionChangedListener[] = [];

    public setSelection(selection: Selection): void {
        let array = selection.toArray();
        this.selection = [];
        for (var i = 0; i < array.length; i++) {
            this.selection.push(array[i]);
        }
        this.notifyListeners();
    }

    public getSelection(): Selection {
        return new Selection(this.selection);
    }

    public addSelectionChangedListener(listener: SelectionChangedListener): void {
        if (this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener);
        }
    }

    public removeSelectionChangedListener(listener: SelectionChangedListener): void {
        if (this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener);
        }
    }

    protected notifyListeners(): void {
        let event = new SelectionChangedEvent(this, this.getSelection());
        for (var i = 0; i < this.listeners.length; i++) {
            let listener = this.listeners[i];
            listener.selectionChanged(event);
        }
    }

}
