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
import * as util from "webface/model/util";

import XUnitSpec from "vegazoo/model/XUnitSpec";
import VegazooFactory from "vegazoo/model/VegazooFactory";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";

import Projector from "vegazoo/directors/projectors/Projector";
import ProjectorRegistry from "vegazoo/directors/projectors/ProjectorRegistry";

export default class TopLevelUnitSpecProjector extends Projector {

    public transform(oldModel: XTopLevelSpec): XTopLevelSpec {

        if (oldModel instanceof XTopLevelUnitSpec) {

            return oldModel;

        } else {

            let factory = VegazooFactory.eINSTANCE;
            let topSpec = factory.createTopLevelUnitSpec();

            let models = util.getDescendantsByModelClass(oldModel, XUnitSpec);
            for (let child of models) {
                let childSpec = <XUnitSpec>child;
                this.projectFeature(childSpec, XTopLevelUnitSpec.FEATURE_DATA, topSpec);
                this.projectFeature(childSpec, XTopLevelUnitSpec.FEATURE_MARK, topSpec);
                this.projectReference(
                    childSpec, XUnitSpec.FEATURE_ENCODING,
                    topSpec, XTopLevelUnitSpec.FEATURE_ENCODING, XFacetedEncoding.XCLASSNAME);
                break;
            }
            return topSpec;
        }
    }

}

let registry = ProjectorRegistry.getInstance();
registry.register(XTopLevelUnitSpec.XCLASSNAME, new TopLevelUnitSpecProjector());
