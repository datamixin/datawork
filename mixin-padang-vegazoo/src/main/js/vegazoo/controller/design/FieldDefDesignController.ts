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
import * as wef from "webface/wef";

import Map from "webface/util/Map";
import ObjectMap from "webface/util/ObjectMap";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import Notification from "webface/model/Notification";

import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import RootViewerAreaRequestHandler from "webface/wef/base/RootViewerAreaRequestHandler";

import * as bekasi from "bekasi/directors";

import VisageType from "bekasi/visage/VisageType";

import * as padang from "padang/padang";
import * as participants from "padang/directors";

import FieldDragParticipant from "padang/directors/FieldDragParticipant";

import *  as vegazoo from "vegazoo/vegazoo";

import * as directors from "vegazoo/directors";
import { AggregateOp } from "vegazoo/constants";
import { StandardType } from "vegazoo/constants";
import { FIELD_TYPE_MAP } from "vegazoo/constants";

import XFieldDef from "vegazoo/model/XFieldDef";
import XEncoding from "vegazoo/model/XEncoding";
import VegazooFactory from "vegazoo/model/VegazooFactory";
import XFacetedEncoding from "vegazoo/model/XFacetedEncoding";

import FieldDefDesignView from "vegazoo/view/design/FieldDefDesignView";

import FieldDefDragDirector from "vegazoo/directors/FieldDefDragDirector";

import FieldDefTypeSetCommand from "vegazoo/commands/FieldDefTypeSetCommand";

import FieldDefClearRequest from "vegazoo/requests/design/FieldDefClearRequest";
import FieldDefRemoveRequest from "vegazoo/requests/design/FieldDefRemoveRequest";
import FieldDefTypeSetRequest from "vegazoo/requests/design/FieldDefTypeSetRequest";
import FieldDefDragAreaRequest from "vegazoo/requests/design/FieldDefDragAreaRequest";
import FieldDefSelectionRequest from "vegazoo/requests/design/FieldDefSelectionRequest";
import FieldDefDropVerifyRequest from "vegazoo/requests/design/FieldDefDropVerifyRequest";
import FieldDefDropObjectRequest from "vegazoo/requests/design/FieldDefDropObjectRequest";
import FieldDefDragSourceDragRequest from "vegazoo/requests/design/FieldDefDragSourceDragRequest";
import FieldDefDragSourceStopRequest from "vegazoo/requests/design/FieldDefDragSourceStopRequest";
import FieldDefDragSourceStartRequest from "vegazoo/requests/design/FieldDefDragSourceStartRequest";

import ObjectDefDesignController from "vegazoo/controller/design/ObjectDefDesignController";

export abstract class FieldDefDesignController extends ObjectDefDesignController {

	constructor() {
		super();
		this.addParticipant(participants.FIELD_DRAG_PARTICIPANT, new FieldDefDragParticipant(this));
		this.addParticipant(participants.PREFACE_DRAG_PARTICIPANT, new FieldDefDragParticipant(this));
		this.addParticipant(directors.FIELD_DEF_DRAG_PARTICIPANT, new FieldDefDragParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FieldDefClearRequest.REQUEST_NAME, new FieldDefClearHandler(this));
		super.installRequestHandler(FieldDefRemoveRequest.REQUEST_NAME, new FieldDefRemoveHandler(this));
		super.installRequestHandler(FieldDefTypeSetRequest.REQUEST_NAME, new FieldDefTypeSetHandler(this));
		super.installRequestHandler(FieldDefDragAreaRequest.REQUEST_NAME, new RootViewerAreaRequestHandler(this));
		super.installRequestHandler(FieldDefSelectionRequest.REQUEST_NAME, new FieldDefSelectionHandler(this));
		super.installRequestHandler(FieldDefDropVerifyRequest.REQUEST_NAME, new FieldDefDropVerifyHandler(this));
		super.installRequestHandler(FieldDefDropObjectRequest.REQUEST_NAME, new FieldDefDropObjectHandler(this));
		super.installRequestHandler(FieldDefDragSourceDragRequest.REQUEST_NAME, new FieldDefDragSourceDragHandler(this));
		super.installRequestHandler(FieldDefDragSourceStopRequest.REQUEST_NAME, new FieldDefDragSourceStopHandler(this));
		super.installRequestHandler(FieldDefDragSourceStartRequest.REQUEST_NAME, new FieldDefDragSourceStartHandler(this));
	}

	public createView(): FieldDefDesignView {
		return new FieldDefDesignView(this);
	}

	public getView(): FieldDefDesignView {
		return <FieldDefDesignView>super.getView();
	}

	public getModel(): XFieldDef {
		return <XFieldDef>super.getModel();
	}

	public refreshChildren(): void {
		super.refreshChildren();
		this.relayout();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
		this.refreshField();
		this.refreshType();
		this.refreshAggregate();
	}

	public refreshName(): void {
		let model = this.getModel();
		let view = this.getView();
		let capitalize = vegazoo.getCapitalizedContainingFeatureName(model);
		view.setName(capitalize);
	}

	private refreshField(): void {
		let model = this.getModel();
		let encoded = model.getField();
		if (encoded !== null) {
			let decoded = atob(encoded);
			let view = this.getView();
			view.setField(decoded);
		}
	}

	private refreshType(): void {
		let model = this.getModel();
		let type = model.getType();
		let view = this.getView();
		view.setType(type);
	}

	private refreshAggregate(): void {
		let model = this.getModel();
		let aggregate = model.getAggregate();
		let view = this.getView();
		view.setAggregate(aggregate);
	}

	public abstract createFieldDef(): XFieldDef;

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XFieldDef.FEATURE_FIELD) {
				this.refreshField();
			} else if (feature === XFieldDef.FEATURE_TYPE) {
				this.refreshType();
			} else if (feature === XFieldDef.FEATURE_AGGREGATE) {
				this.refreshAggregate();
			}
		}
	}

}

export default FieldDefDesignController;

class FieldDefSelectionHandler extends BaseHandler {

	public handle(): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

class FieldDefDragParticipant extends FieldDragParticipant {

	public start(data: ObjectMap<any>): void {

		let accepted = false;
		if (data.containsKey(padang.FIELD_FORMULA)) {
			accepted = true;
		}

		let view = this.getView();
		view.dragStart(accepted);
	}

}

class FieldDefDropVerifyHandler extends BaseHandler {

	public handle(request: FieldDefDropVerifyRequest, callback: (data: any) => void): void {
		let data = <Map<any>>request.getData(FieldDefDropVerifyRequest.DATA);
		if (data.containsKey(padang.FIELD_FORMULA)) {
			callback(null);
		} else {
			callback("Missing drag data '" + padang.FIELD_FORMULA + "'");
		}
	}

}

class FieldDefDropObjectHandler extends BaseHandler {

	public handle(request: FieldDefDropObjectRequest): void {

		let controller = <FieldDefDesignController>this.controller;
		let target = <XFieldDef>controller.getModel();
		let targetEClass = target.eClass();

		let data = <Map<any>>request.getData(FieldDefDropVerifyRequest.DATA);
		let source = <EObject>data.get(padang.DRAG_SOURCE);
		let sourceEClass = source.eClass();
		let container = source.eContainer();
		let factory = VegazooFactory.eINSTANCE;
		if (container instanceof XEncoding) {

			// Drop dari encoding lain
			if (target !== source) {

				// Reset encoding source
				let emptyDef = <XFieldDef>factory.create(sourceEClass);
				let resetCommand = new ReplaceCommand();
				resetCommand.setModel(source);
				resetCommand.setReplacement(emptyDef);

				// Copy all feature from source to target
				let oldModel = <XFieldDef>source;
				let newModel = factory.create(targetEClass);
				let oldFeatures = oldModel.eFeatures();
				let newFeatures = newModel.eFeatures();
				for (let newFeature of newFeatures) {
					for (let oldFeature of oldFeatures) {
						if (newFeature === oldFeature) {
							let oldValue = oldModel.eGet(oldFeature);
							if (oldValue instanceof EObject) {
								oldValue = util.copy(oldValue);
							}
							newModel.eSet(newFeature, oldValue);
						}
					}
				}
				// Replace target field
				let replaceCommand = new ReplaceCommand();
				replaceCommand.setModel(target);
				replaceCommand.setReplacement(newModel);

				let group = new CommandGroup([resetCommand, replaceCommand]);
				controller.execute(group);

			}

		} else {

			let replacement: XFieldDef = null;
			let formula = <string>data.get(padang.FIELD_FORMULA);
			let encoded = btoa(formula);
			let kind = <string>data.get(padang.FIELD_KIND);
			let fieldType = <string>data.get(padang.FIELD_TYPE);
			let fieldPresume = <string>data.get(padang.FIELD_PRESUME);
			if (fieldPresume === VisageType.COLUMN) {

				// Tipe kolom di sesuaikan dengan tipe encoding
				let standardType = FIELD_TYPE_MAP[fieldType];
				if (standardType === StandardType.TEMPORAL) {
					let name = vegazoo.getContainingFeatureName(target);
					if (name === XFacetedEncoding.FEATURE_ROW.getName() ||
						name === XFacetedEncoding.FEATURE_COLUMN.getName() ||
						name === XFacetedEncoding.FEATURE_COLOR.getName() ||
						name === XFacetedEncoding.FEATURE_FACET.getName()) {
						standardType = StandardType.ORDINAL;
					}
				}

				let fieldDef = <XFieldDef>factory.create(targetEClass);
				fieldDef.setField(encoded);
				fieldDef.setType(standardType);
				if (kind === padang.FIELD_KIND_COUNT) {
					fieldDef.setAggregate(AggregateOp.COUNT);
				}
				replacement = fieldDef;

			}

			if (replacement !== null) {

				// Replace ke encoding target
				let command = new ReplaceCommand();
				command.setModel(target);
				command.setReplacement(replacement);
				controller.execute(command);

			}

		}

	}

}

class FieldDefTypeSetHandler extends BaseHandler {

	public handle(request: FieldDefTypeSetRequest): void {
		let controller = <FieldDefDesignController>this.controller;
		let field = controller.getModel();
		let type = request.getData(FieldDefTypeSetRequest.TYPE);
		let command = new FieldDefTypeSetCommand();
		command.setFieldDef(field);
		command.setType(type);
		controller.execute(command);
	}

}

class FieldDefClearHandler extends BaseHandler {

	public handle(): void {
		let controller = <FieldDefDesignController>this.controller;
		let removed = !controller.isActive();
		if (!removed) {
			let model = controller.getModel();
			let fieldDef = controller.createFieldDef();
			let command = new ReplaceCommand();
			command.setModel(model);
			command.setReplacement(fieldDef);
			controller.execute(command);
		}
	}

}

class FieldDefRemoveHandler extends BaseHandler {

	public handle(): void {
		let controller = <FieldDefDesignController>this.controller;
		let model = controller.getModel();
		let command = new RemoveCommand();
		command.setModel(model);
		this.controller.execute(command);
	}

}

class FieldDefDragSourceStartHandler extends BaseHandler {

	public handle(_request: FieldDefDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <FieldDefDesignController>this.controller;
		let data = new ObjectMap<any>();

		let field = controller.getModel();
		let name = field.getField();
		let type = field.getType();
		let aggregate = field.getAggregate();
		let kind = aggregate === AggregateOp.COUNT ? padang.FIELD_KIND_COUNT : padang.FIELD_KIND_VALUE;
		data.put(padang.FIELD_FORMULA, name);
		data.put(padang.FIELD_TYPE, type);
		data.put(padang.FIELD_KIND, kind);
		data.put(padang.DRAG_SOURCE, field);

		let director = directors.getFieldDefDragDirector(this.controller);
		director.start(data);

		callback(data);

	}
}

class FieldDefDragSourceDragHandler extends BaseHandler {

	public handle(request: FieldDefDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(FieldDefDragSourceDragRequest.DATA);
		let x = <number>request.getData(FieldDefDragSourceDragRequest.X);
		let y = <number>request.getData(FieldDefDragSourceDragRequest.Y);
		let director = directors.getFieldDefDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class FieldDefDragSourceStopHandler extends BaseHandler {

	private director: FieldDefDragDirector = null;

	constructor(controller: FieldDefDesignController) {
		super(controller);
		this.director = directors.getFieldDefDragDirector(this.controller);
	}

	public handle(): void {
		this.director.stop();
	}

}
