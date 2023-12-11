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
import XMember from "sleman/model/XMember";
import SlemanFactory from "sleman/model/SlemanFactory";

import VisageBrief from "bekasi/visage/VisageBrief";
import VisageValue from "bekasi/visage/VisageValue";

import GraphicPremise from "padang/ui/GraphicPremise";

import BriefValue from "padang/functions/system/BriefValue";

import XOutlook from "vegazoo/model/XOutlook";
import XFieldDef from "vegazoo/model/XFieldDef";
import XVegalite from "vegazoo/model/XVegalite";
import XObjectDef from "vegazoo/model/XObjectDef";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import CreationalResultMapping from "vegazoo/directors/converters/CreationalResultMapping";

export default class OutputPartSupport {

	private spec: any = {};
	private premise: GraphicPremise = null;

	constructor(premise: GraphicPremise) {
		this.premise = premise;
	}

	public getPremise(): GraphicPremise {
		return this.premise;
	}

	public getLastSpec(): any {
		return this.spec;
	}

	public createSpec(container: XTopLevelSpec | XOutlook, callback: (spec: any) => void): void {
		let topLevelSpec: XTopLevelSpec = <any>container;
		if (container instanceof XOutlook) {
			let viewlet = <XVegalite>container.getViewlet();
			topLevelSpec = viewlet.getSpec();
		}
		let mapping = new CreationalResultMapping(this.premise, topLevelSpec);
		this.loadFieldBriefMap(mapping, (fieldBriefMap: Map<XObjectDef, VisageBrief>) => {
			mapping.buildDatasets(fieldBriefMap, (spec: any) => {
				this.spec = spec;
				callback(spec);
			});
		});
	}

	private loadFieldBriefMap(mapping: CreationalResultMapping,
		callback: (briefMap: Map<XObjectDef, VisageBrief>) => void): void {

		let total = 0;
		for (let unit of mapping.getViews()) {
			let fieldList = mapping.getFieldList(unit);
			total += fieldList.length;
		}

		let briefMap = new Map<XObjectDef, VisageBrief>();
		let counter = 0;
		for (let unit of mapping.getViews()) {
			let fieldList = mapping.getFieldList(unit);
			if (fieldList.length === 0) {
				callback(briefMap);
			} else {
				for (let field of fieldList) {
					if (field instanceof XFieldDef) {
						let encoded = field.getField();
						let literal = atob(encoded);
						let expression = this.premise.parse(literal);
						if (expression instanceof XMember) {

							// Field is dataset column member
							let factory = SlemanFactory.eINSTANCE;
							let call = factory.createXCall(BriefValue.FUNCTION_NAME, expression);
							this.premise.evaluate(call, (brief: VisageValue) => {
								if (brief instanceof VisageBrief) {
									briefMap.set(field, brief);
								}
								counter++;
								if (counter === total) {
									callback(briefMap);
								}

							});

						} else {

							// Field is inline data or other
							counter++;
							if (counter === total) {
								callback(briefMap);
							}

						}
					}
				}
			}
		}
	}

}