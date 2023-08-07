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
import Popup from "webface/popup/Popup";

export default class PopupRegistry {

    private popups: Popup[] = [];
    private static instance: PopupRegistry = new PopupRegistry();

    constructor() {
        if (PopupRegistry.instance) {
            throw new Error("Instantiation failed, use PopupRegistry.getInstance() instead of new");
        }
        PopupRegistry.instance = this;
    }

    public static getInstance(): PopupRegistry {
        return PopupRegistry.instance;
    }

    public register(popup: Popup): void {
        this.popups.push(popup);
    }

    public getOpenStack(): Popup[] {
        return this.popups;
    }

    public closeOpens(excepts: Popup[]): void {
        let closses: Popup[] = [];
        for (var i = 0; i < this.popups.length; i++) {
            let popup = this.popups[i];
            let exclude = false;
            for (var j = 0; j < excepts.length; j++) {
                let except = excepts[j];
                if (popup === except) {
                    exclude = true;
                    break;
                }
            }
            if (exclude === false) {
                closses.push(popup);
            }
        }
        for (var i = 0; i < closses.length; i++) {
            let popup = closses[i];
            popup.close();
        }
    }

    public remove(popup: Popup): void {
        let index = this.popups.indexOf(popup);
        if (index >= 0) {
            this.popups.splice(index, 1);
        }
    }
}

export let registry = PopupRegistry.getInstance();
