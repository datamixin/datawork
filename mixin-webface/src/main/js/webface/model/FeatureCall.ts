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
import EObject from "webface/model/EObject";
import FeaturePath from "webface/model/FeaturePath";
import FeatureMark from "webface/model/FeatureMark";

export default class FeatureCall extends FeatureMark {

    public static BEAN_NAME = "FeatureCall";

    private arguments: any[] = [];

    constructor(model: EObject | FeaturePath, name: string, args?: any[]) {
        super(model, name, FeatureCall.BEAN_NAME);
        if (args !== undefined) {
            this.arguments = args;
        }
    }

    public getArguments(): any[] {
        return this.arguments;
    }

    public newFeatureCall(): FeatureCall {
        let qualifier = new FeatureCall(this.path, this.name);
        return qualifier;
    }

    public static newFeatureCall(featureMark: FeatureMark): FeatureCall {
        let featurePath = featureMark.getPath();
        let name = featureMark.getName();
        return new FeatureCall(featurePath, name);
    }
}