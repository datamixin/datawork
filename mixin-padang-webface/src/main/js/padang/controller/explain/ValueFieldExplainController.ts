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
import ObjectMap from "webface/util/ObjectMap";

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";
import RootViewerAreaRequestHandler from "webface/wef/base/RootViewerAreaRequestHandler";

import * as bekasi from "bekasi/directors";

import VisageValue from "bekasi/visage/VisageValue";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import ValueField from "padang/model/ValueField";

import ValueFieldExplainView from "padang/view/explain/ValueFieldExplainView";

import ValueFieldPrefaceSetCommand from "padang/commands/ValueFieldPrefaceSetCommand";

import PrefaceDragAreaRequest from "padang/requests/explain/PrefaceDragAreaRequest";
import ValueFieldPrefaceSetRequest from "padang/requests/explain/ValueFieldPrefaceSetRequest";
import PrefaceDragSourceDragRequest from "padang/requests/explain/PrefaceDragSourceDragRequest";
import PrefaceDragSourceStopRequest from "padang/requests/explain/PrefaceDragSourceStopRequest";
import PrefaceDragSourceStartRequest from "padang/requests/explain/PrefaceDragSourceStartRequest";

export abstract class ValueFieldExplainController extends EObjectController {

	constructor() {
		super();
		super.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(PrefaceDragAreaRequest.REQUEST_NAME, new RootViewerAreaRequestHandler(this));
		super.installRequestHandler(ValueFieldPrefaceSetRequest.REQUEST_NAME, new ValueFieldPrefaceSetHandler(this));
		super.installRequestHandler(PrefaceDragSourceDragRequest.REQUEST_NAME, new PrefaceDragSourceDragHandler(this));
		super.installRequestHandler(PrefaceDragSourceStopRequest.REQUEST_NAME, new PrefaceDragSourceStopHandler(this));
		super.installRequestHandler(PrefaceDragSourceStartRequest.REQUEST_NAME, new PrefaceDragSourceStartHandler(this));
	}

	public getModel(): ValueField {
		return <ValueField>super.getModel();
	}

	public getView(): ValueFieldExplainView {
		return <ValueFieldExplainView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshType();
		this.refreshPrefaceList();
		this.refreshPrefaceResult();
		this.relayout();
	}

	private refreshType(): void {
		let model = this.getModel();
		let type = model.getType();
		let view = this.getView();
		view.setType(type);
	}

	private getPrefaceNames(): Map<string, string> {
		let model = this.getModel();
		let director = directors.getVariableFieldDirector(this);
		let names = director.listPrefacePresumes(model);
		return names;
	}

	private refreshPrefaceList(): void {
		let names = this.getPrefaceNames();
		let view = this.getView();
		view.setPrefaceNames(names);
	}

	private refreshPrefaceResult(): void {
		let model = this.getModel();
		let preface = model.getPreface();
		if (preface === null) {
			let names = this.getPrefaceNames();
			if (names.size > 0) {
				let keys = names.keys();
				let result = keys.next()
				model.setPreface(result.value);
			}
		}
		let view = this.getView();
		preface = model.getPreface();
		view.setSelectedPreface(preface);
		setTimeout(() => {
			let director = directors.getVariableFieldDirector(this);
			director.loadPrefaceExample(model, (result: VisageValue) => {
				let view = this.getView();
				view.setPrefaceExample(result);
				this.relayout();
			});
		}, 0);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === ValueField.FEATURE_TYPE) {
				this.refreshType();
			} else if (feature === ValueField.FEATURE_PREFACE) {
				this.refreshPrefaceResult();
			}

		}
	}

}

export default ValueFieldExplainController;

class ValueFieldPrefaceSetHandler extends BaseHandler {

	public handle(request: ValueFieldPrefaceSetRequest, _callback: (data: any) => void): void {
		let preface = request.getStringData(ValueFieldPrefaceSetRequest.PREFACE);
		let model = <ValueField>this.controller.getModel()
		let command = new ValueFieldPrefaceSetCommand();
		command.setPreface(preface);
		command.setValueField(model);
		this.controller.execute(command);
	}

}

class PrefaceDragSourceStartHandler extends BaseHandler {

	private getPointerFormula(field: ValueField): string {
		let director = directors.getVariableFieldDirector(this.controller);
		let pointer = director.createPointer(field);
		return "=" + pointer;
	}

	public handle(_request: PrefaceDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <ValueFieldExplainController>this.controller;
		let field = controller.getModel();
		let data = new ObjectMap<any>();

		let formula = this.getPointerFormula(field);
		let fieldType = field.getType();
		let fieldKind = padang.FIELD_KIND_VALUE;
		let fieldPropose = field.getPropose();
		data.put(padang.FIELD_FORMULA, formula);
		data.put(padang.FIELD_TYPE, fieldType);
		data.put(padang.FIELD_KIND, fieldKind);
		data.put(padang.FIELD_PRESUME, fieldPropose);
		data.put(padang.DRAG_SOURCE, field);

		let director = directors.getPrefaceDragDirector(this.controller);
		director.start(data);

		callback(data);

	}
}

class PrefaceDragSourceDragHandler extends BaseHandler {

	private replaceFormulaData(data: ObjectMap<any>): void {
		let preface = data.get(padang.PREFACE);
		let director = directors.getVariableFieldDirector(this.controller);
		let field = <ValueField>this.controller.getModel();
		let formula = director.getPrefaceFormula(field, preface);
		let presumes = director.listPrefacePresumes(field);
		let presume = presumes.get(preface);
		data.put(padang.FIELD_FORMULA, formula);
		data.put(padang.FIELD_PRESUME, presume);
	}

	public handle(request: PrefaceDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(PrefaceDragSourceDragRequest.DATA);
		let x = <number>request.getData(PrefaceDragSourceDragRequest.X);
		let y = <number>request.getData(PrefaceDragSourceDragRequest.Y);
		this.replaceFormulaData(data);
		let director = directors.getPrefaceDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class PrefaceDragSourceStopHandler extends BaseHandler {

	public handle(_request: PrefaceDragSourceStopRequest, _callback: (data: any) => void): void {
		let director = directors.getPrefaceDragDirector(this.controller);
		director.stop();
	}

}