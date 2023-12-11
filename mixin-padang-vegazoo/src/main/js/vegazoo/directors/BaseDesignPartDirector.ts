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
import EObject from "webface/model/EObject";

import Controller from "webface/wef/Controller";
import CommandGroup from "webface/wef/CommandGroup";

import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import * as padang from "padang/padang";

import VisageObject from "bekasi/visage/VisageObject";

import ValueField from "padang/model/ValueField";
import CountField from "padang/model/CountField";

import ValueMapping from "padang/util/ValueMapping";

import GraphicPremise from "padang/ui/GraphicPremise";

import XOutlook from "vegazoo/model/XOutlook";
import XEncoding from "vegazoo/model/XEncoding";
import XUnitSpec from "vegazoo/model/XUnitSpec";
import XFieldDef from "vegazoo/model/XFieldDef";
import XLayerSpec from "vegazoo/model/XLayerSpec";
import XHConcatSpec from "vegazoo/model/XHConcatSpec";
import XVConcatSpec from "vegazoo/model/XVConcatSpec";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";
import VegazooCreator from "vegazoo/model/VegazooCreator";
import XFacetedUnitSpec from "vegazoo/model/XFacetedUnitSpec";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";
import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";
import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";

import { AggregateOp } from "vegazoo/constants";
import { StandardType } from "vegazoo/constants";

import GraphicPartViewer from "vegazoo/ui/GraphicPartViewer";

import XVegalite from "vegazoo/model/XVegalite";

import DesignPartDirector from "vegazoo/directors/DesignPartDirector";

import DesignTemplate from "vegazoo/directors/templates/DesignTemplate";
import DesignTemplateRegistry from "vegazoo/directors/templates/DesignTemplateRegistry";

import ModelConverter from "vegazoo/directors/converters/ModelConverter";

import MarkDefTypeSetCommand from "vegazoo/commands/MarkDefTypeSetCommand";

import ProjectorRegistry from "vegazoo/directors/projectors/ProjectorRegistry";

import OutlookDesignController from "vegazoo/controller/design/OutlookDesignController";
import MarkDefDesignController from "vegazoo/controller/design/MarkDefDesignController";
import FieldDefDesignController from "vegazoo/controller/design/FieldDefDesignController";
import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

export default class BaseDesignPartDirector implements DesignPartDirector {

	private viewer: GraphicPartViewer = null;
	private mapping: ValueMapping = null;

	constructor(viewer: GraphicPartViewer, premise: GraphicPremise) {
		this.viewer = viewer;
		this.mapping = premise.getMapping();
	}

	public getModeMap(): Map<string, string> {
		let map = new Map<string, string>();
		map.set(XUnitSpec.XCLASSNAME, "Unit");
		map.set(XLayerSpec.XCLASSNAME, "Layer");
		map.set(XVConcatSpec.XCLASSNAME, "Vertical");
		map.set(XHConcatSpec.XCLASSNAME, "Horizontal");
		return map;
	}

	public getTopLevelModeMap(): Map<string, string> {
		let map = new Map<string, string>();
		map.set(XTopLevelUnitSpec.XCLASSNAME, "Unit");
		map.set(XTopLevelLayerSpec.XCLASSNAME, "Layer");
		map.set(XTopLevelVConcatSpec.XCLASSNAME, "Vertical");
		map.set(XTopLevelHConcatSpec.XCLASSNAME, "Horizontal");
		map.set(XTopLevelFacetSpec.XCLASSNAME, "Facet");
		return map;
	}

	public getMapping(): ValueMapping {
		return this.mapping;
	}

	public getTemplates(): DesignTemplate[] {
		let registry = DesignTemplateRegistry.getInstance();
		return registry.getTemplates();
	}

	public createOutlook(): XOutlook {

		if (this.mapping.containsValue(padang.FORMATION) === false) {

			// Buat report dari visage table
			let outlook = this.createDefaultOutlook();

			let converter = new ModelConverter();
			let value = converter.convertModelToValue(outlook);
			this.mapping.setValue(padang.FORMATION, value);

			return outlook;

		} else {

			let converter = new ModelConverter();
			let value = <VisageObject>this.mapping.getValue(padang.FORMATION);
			return <XOutlook>converter.convertValueToModel(value);

		}
	}

	private createDefaultOutlook(): XOutlook {

		let templates = this.getTemplates();
		let template = templates[0];

		let creator = VegazooCreator.eINSTANCE;
		let mark = template.getMarkType();
		return creator.createOutlook(mark);

	}

	private createTopLevelSpec(): XTopLevelSpec {
		let rootController = this.viewer.getRootController();
		let contents = rootController.getContents();
		let outlook = <XOutlook>contents.getModel();
		let vagalite = <XVegalite>outlook.getViewlet();
		let spec = <XTopLevelSpec>vagalite.getSpec();
		return spec;
	}

	private getDefaultMarkType(): string {
		let templates = this.getTemplates();
		let template = templates[0];
		return template.getMarkType();
	}

	public createDefaultUnitSpec(): XUnitSpec {
		let spec = this.createTopLevelSpec();
		let mark = this.getDefaultMarkType();
		let creator = VegazooCreator.eINSTANCE;
		return creator.createUnitSpec(spec, true, mark);
	}

	public createDefaultFacetedUnitSpec(): XFacetedUnitSpec {
		let spec = this.createTopLevelSpec();
		let mark = this.getDefaultMarkType();
		let creator = VegazooCreator.eINSTANCE;
		return creator.createFacetedUnitSpec(spec, true, mark);
	}

	public changeType(origin: MarkDefDesignController, newType: string): void {

		// Buat encoding baru sesuai template
		let controller = origin.getParent();
		let unitSpec = controller.getModel();
		let oldEncoding: XEncoding = null;
		if (unitSpec instanceof XTopLevelUnitSpec) {
			oldEncoding = unitSpec.getEncoding();
		} else if (unitSpec instanceof XUnitSpec) {
			oldEncoding = unitSpec.getEncoding();
		}

		let registry = DesignTemplateRegistry.getInstance();
		let template = registry.get(newType);
		let remapper = template.getEncodingRemapper();
		let newEncoding = remapper.remap(oldEncoding);

		// Ganti encoding di specification
		let replaceCommand = new ReplaceCommand();
		replaceCommand.setModel(oldEncoding);
		replaceCommand.setReplacement(newEncoding);

		// Ganti mark dengan yang baru
		let mark = origin.getModel();
		let type = template.getMarkType();
		let setTypeCommand = new MarkDefTypeSetCommand();
		setTypeCommand.setType(type);
		setTypeCommand.setMark(mark);

		let group = new CommandGroup([replaceCommand, setTypeCommand]);
		origin.execute(group);

	}

	public changeView(controller: TopLevelSpecDesignController, view: string): void {

		// Transform model
		let model = <XTopLevelSpec>controller.getModel();
		let oldCopy = <XTopLevelSpec>util.copy(model);
		let registry = ProjectorRegistry.getInstance();
		let projector = registry.get(view);
		let newModel = projector.transform(oldCopy);

		// Ganti encoding di specification
		let command = new ReplaceCommand();
		command.setModel(model);
		command.setReplacement(newModel);
		controller.execute(command);

	}

	public getInitialAggregate(_controller: FieldDefDesignController, field: ValueField): AggregateOp {
		if (field instanceof CountField) {
			return AggregateOp.COUNT;
		} else if (field.getType() === StandardType.QUANTITATIVE) {
			return AggregateOp.SUM;
		} else {
			return AggregateOp.NONE;
		}
	}

	public getEncodingFieldNames(descendant: Controller, includeOwn?: boolean): string[] {
		let ownModel = <EObject>descendant.getModel();
		let encoding = <XEncoding>util.getAncestor(ownModel, XEncoding);
		let names: string[] = [];
		includeOwn = includeOwn !== undefined ? includeOwn : true;
		if (encoding instanceof XEncoding) {
			let features = encoding.eFeatures();
			for (let feature of features) {
				let channel = <EObject>encoding.eGet(feature);
				if (channel === null) {
					continue;
				}
				if (includeOwn === false) {
					if (util.isAncestor(channel, ownModel) === true) {
						continue;
					}
				}
				let descendants = util.getDescendantsByModelClass(channel, XPositionFieldDef);
				for (let descendant of descendants) {
					let fieldFeature = XPositionFieldDef.FEATURE_FIELD;
					let field = descendant.eGet(fieldFeature);
					if (field !== null) {
						let name = feature.getName();
						if (names.indexOf(name) === -1) {
							names.push(name);
						}
					}
				}
			}
		}
		return names;
	}

	public getEncodingChannelMap(encoding: XEncoding): Map<string, XFieldDef> {
		let map = new Map<string, XFieldDef>();
		if (encoding instanceof XEncoding) {
			let features = encoding.eFeatures();
			for (let feature of features) {
				let channel = <EObject>encoding.eGet(feature);
				if (channel === null) {
					continue;
				}
				let name = feature.getName();
				map.set(name, <XFieldDef>channel);
			}
		}
		return map;
	}

	public getViewerContents(): OutlookDesignController {
		let rootController = this.viewer.getRootController();
		return <OutlookDesignController>rootController.getContents();
	}

}