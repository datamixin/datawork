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
export let DESIGN_PART_DIRECTOR = "design-part-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import ValueField from "padang/model/ValueField";

import XOutlook from "vegazoo/model/XOutlook";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XEncoding from "vegazoo/model/XEncoding";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";

import { AggregateOp } from "vegazoo/constants";

import XFieldDef from "vegazoo/model/XFieldDef";

import DesignTemplate from "vegazoo/directors/templates/DesignTemplate";

import OutlookDesignController from "vegazoo/controller/design/OutlookDesignController";
import MarkDefDesignController from "vegazoo/controller/design/MarkDefDesignController";
import FieldDefDesignController from "vegazoo/controller/design/FieldDefDesignController";
import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

export interface DesignPartDirector {

	getModeMap(): Map<string, string>;

	getTopLevelModeMap(): Map<string, string>;

	getTemplates(): DesignTemplate[];

	createOutlook(): XOutlook;

	createDefaultUnitSpec(controller: Controller): XUnitSpec;

	createDefaultFacetedUnitSpec(controller: Controller): XFacetedUnitSpec;

	changeType(controller: MarkDefDesignController, type: string): void;

	changeView(controller: TopLevelSpecDesignController, view: string): void;

	getInitialAggregate(controller: FieldDefDesignController, field: ValueField): AggregateOp;

	getEncodingFieldNames(descendant: Controller, includeOwn?:boolean): string[];

	getEncodingChannelMap(encoding: XEncoding): Map<string, XFieldDef>;

	getViewerContents(): OutlookDesignController;

}

export function getDesignPartDirector(host: Controller | PartViewer): DesignPartDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <DesignPartDirector>viewer.getDirector(DESIGN_PART_DIRECTOR);
}

export default DesignPartDirector;