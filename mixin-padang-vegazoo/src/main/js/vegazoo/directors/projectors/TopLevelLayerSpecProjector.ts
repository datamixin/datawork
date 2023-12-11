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
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XEncoding from "vegazoo/model/XEncoding";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import VegazooFactory from "vegazoo/model/VegazooFactory";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";

import Projector from "vegazoo/directors/projectors/Projector";
import ProjectorRegistry from "vegazoo/directors/projectors/ProjectorRegistry";

export default class TopLevelLayerSpecProjector extends Projector {

	public transform(oldModel: XTopLevelSpec): XTopLevelSpec {

		if (oldModel instanceof XTopLevelLayerSpec) {

			return oldModel;

		} else {

			let factory = VegazooFactory.eINSTANCE;
			let layerSpec = factory.createTopLevelLayerSpec();

			if (oldModel instanceof XTopLevelUnitSpec) {

				let unitSpec = factory.createUnitSpec();
				this.projectFeature(oldModel, XUnitSpec.FEATURE_DATA, unitSpec);
				this.projectFeature(oldModel, XUnitSpec.FEATURE_MARK, unitSpec);
				this.projectReference(
					oldModel, XTopLevelUnitSpec.FEATURE_ENCODING,
					unitSpec, XUnitSpec.FEATURE_ENCODING, XEncoding.XCLASSNAME);
				let items = layerSpec.getLayer();
				items.add(unitSpec);

			} else if (oldModel instanceof XTopLevelVConcatSpec) {

				let hconcat = oldModel.getVconcat();
				let layer = layerSpec.getLayer();
				this.moveItems(hconcat, layer);

			} else if (oldModel instanceof XTopLevelHConcatSpec) {

				let hconcat = oldModel.getHconcat();
				let layer = layerSpec.getLayer();
				this.moveItems(hconcat, layer);

			} else if (oldModel instanceof XTopLevelFacetSpec) {

				let oldSpec = oldModel.getSpec();
				let layer = layerSpec.getLayer();
				if (oldSpec instanceof XUnitSpec) {
					layer.add(oldSpec);
				} else if (oldSpec instanceof XLayerSpec) {
					let items = oldSpec.getLayer();
					for (let item of items.toArray()) {
						layer.add(item);
					}
				}

			}

			return layerSpec;

		}
	}

}

let registry = ProjectorRegistry.getInstance();
registry.register(XTopLevelLayerSpec.XCLASSNAME, new TopLevelLayerSpecProjector());
