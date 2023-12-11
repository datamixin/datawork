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
import Command from "webface/wef/Command";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";

export default class FeatureSetCommand extends Command {

    private model: EObject;
    private feature: EFeature;
    private newValue: any;
    private oldValue: any;

    public setModel(model: EObject): void {
        this.model = model;
    }

    public getModel(): EObject {
        return this.model;
    }

    public setFeature(feature: EFeature): void {
        this.feature = feature;
    }

    public setValue(value: any): void {
        this.newValue = value;
    }

    public execute(): void {
        this.oldValue = this.model.eGet(this.feature);
        this.model.eSet(this.feature, this.newValue);
    }

    public undo(): void {
        this.model.eSet(this.feature, this.oldValue);
    }

    public redo(): void {
        this.model.eSet(this.feature, this.newValue);
    }

}
