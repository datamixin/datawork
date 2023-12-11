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

import XLayerSpec from "vegazoo/model/XLayerSpec";
import XNumberDef from "vegazoo/model/XNumberDef";

export default class OverlayHeightSetCommand extends Command {

	private model: EObject = null;
	private feature: EFeature = null;
	private oldHeight: XNumberDef = null;
	private newHeight: XNumberDef = null;

	public setModel(object: EObject): void {
		this.model = object;
		let features = this.model.eFeatures();
		for (let feature of features) {
			let name = feature.getName();
			if (name === XLayerSpec.FEATURE_HEIGHT.getName()) {
				this.feature = feature;
			}
		}
	}

	public setHeight(height: XNumberDef): void {
		this.newHeight = height;
	}

	public execute(): void {
		this.oldHeight = this.model.eGet(this.feature);
		this.model.eSet(this.feature, this.newHeight);
	}

	public undo(): void {
		this.model.eSet(this.feature, this.oldHeight);
	}

	public redo(): void {
		this.model.eSet(this.feature, this.newHeight);
	}

}