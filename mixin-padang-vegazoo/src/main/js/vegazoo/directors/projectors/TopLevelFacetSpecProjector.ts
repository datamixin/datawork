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
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XEncoding from "vegazoo/model/XEncoding";
import VegazooFactory from "vegazoo/model/VegazooFactory";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";

import Projector from "vegazoo/directors/projectors/Projector";
import ProjectorRegistry from "vegazoo/directors/projectors/ProjectorRegistry";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

export default class TopLevelFacetSpecProjector extends Projector {

	public transform(oldModel: XTopLevelSpec): XTopLevelSpec {

		if (oldModel instanceof XTopLevelFacetSpec) {

			return oldModel;

		} else {

			let factory = VegazooFactory.eINSTANCE;
			let facetSpec = factory.createTopLevelFacetSpec();

			let layerSpec = factory.createLayerSpec();
			facetSpec.setSpec(layerSpec);

			let facetField = factory.createFacetFieldDef();
			facetSpec.setFacet(facetField);

			let newLayer = layerSpec.getLayer();

			if (oldModel instanceof XTopLevelUnitSpec) {

				let unitSpec = factory.createUnitSpec();
				this.projectFeature(oldModel, XUnitSpec.FEATURE_DATA, facetSpec);
				this.projectFeature(oldModel, XUnitSpec.FEATURE_TITLE, unitSpec);
				this.projectFeature(oldModel, XUnitSpec.FEATURE_MARK, unitSpec);
				this.projectReference(
					oldModel, XTopLevelUnitSpec.FEATURE_ENCODING,
					unitSpec, XUnitSpec.FEATURE_ENCODING, XEncoding.XCLASSNAME);

				newLayer.add(unitSpec);

			} else if (oldModel instanceof XTopLevelLayerSpec) {

				let oldLayer = oldModel.getLayer();
				this.moveItems(oldLayer, newLayer);

			} else if (oldModel instanceof XTopLevelVConcatSpec) {

				let hconcat = oldModel.getVconcat();
				this.moveItems(hconcat, newLayer);

			} else if (oldModel instanceof XTopLevelHConcatSpec) {

				let hconcat = oldModel.getHconcat();
				this.moveItems(hconcat, newLayer);

			}
			return facetSpec;

		}
	}

}

let registry = ProjectorRegistry.getInstance();
registry.register(XTopLevelFacetSpec.XCLASSNAME, new TopLevelFacetSpecProjector());
