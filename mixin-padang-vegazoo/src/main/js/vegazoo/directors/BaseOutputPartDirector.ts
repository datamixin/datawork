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
import * as functions from "webface/wef/functions";

import * as padang from "padang/padang";

import ValueMapping from "padang/util/ValueMapping";

import XOutlook from "vegazoo/model/XOutlook";
import XVegalite from "vegazoo/model/XVegalite";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import GraphicPartViewer from "vegazoo/ui/GraphicPartViewer";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";
import OutputPartDirector from "vegazoo/directors/OutputPartDirector";

import ModelConverter from "vegazoo/directors/converters/ModelConverter";

import VegaliteOutputController from "vegazoo/controller/output/VegaliteOutputController";
import GraphicPremise from "padang/ui/GraphicPremise";

export default class BaseOutputPartDirector implements OutputPartDirector {

	private viewer: GraphicPartViewer;
	private mapping: ValueMapping = null;
	private support: OutputPartSupport = null;

	constructor(viewer: GraphicPartViewer, premise: GraphicPremise) {
		this.viewer = viewer;
		this.mapping = premise.getMapping();
		this.support = new OutputPartSupport(premise);
	}

	public getLastSpec(): any {
		return this.support.getLastSpec();
	}

	public createSpec(topLevelSpec: XTopLevelSpec, callback: (spec: any) => void): void {
		this.support.createSpec(topLevelSpec, callback);
	}

	public outlookChanged(outlook: XOutlook): void {
		let converter = new ModelConverter();
		let value = converter.convertModelToValue(outlook);
		this.mapping.setValue(padang.FORMATION, value);
		this.mapping.setValueAsFormula(padang.FORMATION);
	}

	public refresh(): void {
		let rootController = this.viewer.getRootController();
		let controller = functions.getFirstDescendantByModelClass(rootController, XVegalite);
		(<VegaliteOutputController>controller).refreshVisuals();
	}

}