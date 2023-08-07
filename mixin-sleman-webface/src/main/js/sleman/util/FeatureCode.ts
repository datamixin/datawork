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
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";

export default class FeatureCode {

    private model: EObject;

    constructor(model: EObject) {
        this.model = model;
    }

    public generate(): string {

        let current: EObject = this.model;
        let buffer: string[] = [];
        while (current != null) {

            let feature = current.eContainingFeature();
            let container = current.eContainer();
            if (container != null) {

                let value = container.eGet(feature);
                if (value instanceof EList) {
                    let list = value.toArray();
                    this.encodeElement(buffer, list, current, true);
                }

                let features = container.eFeatures();
                this.encodeElement(buffer, features, feature, false);
            }
            current = container;
        }
        return buffer.join("");
    }

    private encodeElement(buffer: string[], list: any[], element: any, flag: boolean): void {
        let index = list.indexOf(element);
        this.encodeIndex(buffer, index, flag);
    }

    private encodeIndex(buffer: string[], index: number, flag: boolean): void {
        let hex = index.toString(16);
        buffer.splice(0, 0, hex);
        if (flag) {
            let length = hex.length;
            let lengthHex = length.toString(16);
            buffer.splice(0, 0, lengthHex);
        }
    }

    public static generate(model: EObject): string {
        let code = new FeatureCode(model);
        return code.generate();
    }

}
