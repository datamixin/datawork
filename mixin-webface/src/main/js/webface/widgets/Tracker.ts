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
import Composite from "webface/widgets/Composite";

export default class Tracker {

    private composite: Composite = null;
    private states: any[] = [];

    constructor(composite: Composite) {
        this.composite = composite;
        this.captureState();
    }

    private captureState(): void {
        let children = this.composite.getChildren();
        for (let child of children) {
            let state: any = {};
            let layoutData = child.getLayoutData();
            let keys = Object.keys(layoutData);
            for (let key of keys) {
                state[key] = layoutData[key];
            }
            this.states.push(state);
        }
    }

    public relayout(): void {

        let children = this.composite.getChildren();
        if (this.states.length !== children.length) {

            // Relayout jika jumlah children berubah 
            this.layoutComposite();
            return;
        }
        for (let i = 0; i < this.states.length; i++) {

            let state = this.states[i];
            let child = children[i];
            let layoutData = child.getLayoutData();
            let keys = Object.keys(layoutData);
            for (let key of keys) {

                // Relayout minimal ada satu state yang berubah
                if (state[key] !== layoutData[key]) {
                    this.layoutComposite();
                    return;
                }
            }
        }
    }

    private layoutComposite(): void {
        let layout = this.composite.getLayout();
        layout.layout(this.composite);
    }

}
