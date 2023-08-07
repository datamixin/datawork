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
import * as wef from "webface/wef";
import * as functions from "webface/wef/functions";

import EObject from "webface/model/EObject";
import Notification from "webface/model/Notification";

import ObjectMap from "webface/util/ObjectMap";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";
import RootViewerAreaRequestHandler from "webface/wef/base/RootViewerAreaRequestHandler";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import ValueField from "padang/model/ValueField";
import CountField from "padang/model/CountField";
import VariableField from "padang/model/VariableField";

import FormulaEvaluateHandler from "padang/handlers/FormulaEvaluateHandler";

import FormulaEvaluateRequest from "padang/requests/FormulaEvaluateRequest";

import ValueFieldAnatomyView from "padang/view/anatomy/ValueFieldAnatomyView";

import FieldDragAreaRequest from "padang/requests/anatomy/FieldDragAreaRequest";
import FieldDragSourceDragRequest from "padang/requests/anatomy/FieldDragSourceDragRequest";
import FieldDragSourceStopRequest from "padang/requests/anatomy/FieldDragSourceStopRequest";
import FieldDragSourceStartRequest from "padang/requests/anatomy/FieldDragSourceStartRequest";

import ValueFieldSelectRequest from "padang/requests/anatomy/ValueFieldSelectRequest";

export abstract class ValueFieldAnatomyController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(ValueFieldSelectRequest.REQUEST_NAME, new ValueFieldSelectHandler(this));
		super.installRequestHandler(FieldDragAreaRequest.REQUEST_NAME, new RootViewerAreaRequestHandler(this));
		super.installRequestHandler(FieldDragSourceDragRequest.REQUEST_NAME, new FieldDragSourceDragHandler(this));
		super.installRequestHandler(FieldDragSourceStopRequest.REQUEST_NAME, new FieldDragSourceStopHandler(this));
		super.installRequestHandler(FieldDragSourceStartRequest.REQUEST_NAME, new FieldDragSourceStartHandler(this));
		super.installRequestHandler(FormulaEvaluateRequest.REQUEST_NAME, new ValueFieldFormulaEvaluateHandler(this));
	}

	public getModel(): ValueField {
		return <ValueField>super.getModel();
	}

	public getView(): ValueFieldAnatomyView {
		return <ValueFieldAnatomyView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshType();
		this.refreshDigest();
		this.refreshFormula();
	}

	private refreshType(): void {
		let model = this.getModel();
		let type = model.getType();
		let view = this.getView();
		view.setType(type);
	}

	private refreshDigest(): void {
		let model = this.getModel();
		let digest = model.getDigest();
		let view = this.getView();
		view.setInfo(digest);
	}

	private refreshFormula(): void {
		let director = directors.getVariableFieldDirector(this);
		let formula = director.getFieldPointer(this);
		let view = this.getView();
		view.setFormula(formula);
	}

	public abstract getName(): string;

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === ValueField.FEATURE_TYPE) {
				this.refreshType();
			} else if (feature === ValueField.FEATURE_DIGEST) {
				this.refreshDigest();
			}
		}
	}

}

export default ValueFieldAnatomyController;

class ValueFieldSelectHandler extends BaseHandler {

	public handle(_request: ValueFieldSelectRequest, _callback: (data: any) => void): void {
		let controller = wef.getSelectionDirector(this.controller);
		controller.select(this.controller);
	}

}

class FieldDragSourceStartHandler extends BaseHandler {

	private getPointerFormula(field: ValueField): string {
		let director = directors.getVariableFieldDirector(this.controller);
		let pointer = director.createPointer(field);
		return "=" + pointer;
	}

	public handle(_request: FieldDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <ValueFieldAnatomyController>this.controller;
		let field = controller.getModel();
		let data = new ObjectMap<any>();

		let formula = this.getPointerFormula(field);
		let fieldType = field.getType();
		let fieldKind = field instanceof CountField ? padang.FIELD_KIND_COUNT : padang.FIELD_KIND_VALUE;
		let fieldPresume = field.getPropose();
		data.put(padang.FIELD_FORMULA, formula);
		data.put(padang.FIELD_TYPE, fieldType);
		data.put(padang.FIELD_KIND, fieldKind);
		data.put(padang.FIELD_PRESUME, fieldPresume);
		data.put(padang.DRAG_SOURCE, field);

		let director = directors.getFieldDragDirector(this.controller);
		director.start(data);

		callback(data);

	}
}

class FieldDragSourceDragHandler extends BaseHandler {

	public handle(request: FieldDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(FieldDragSourceDragRequest.DATA);
		let x = <number>request.getData(FieldDragSourceDragRequest.X);
		let y = <number>request.getData(FieldDragSourceDragRequest.Y);
		let director = directors.getFieldDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class FieldDragSourceStopHandler extends BaseHandler {

	public handle(_request: FieldDragSourceStopRequest, _callback: (data: any) => void): void {
		let director = directors.getFieldDragDirector(this.controller);
		director.stop();
	}

}

class ValueFieldFormulaEvaluateHandler extends FormulaEvaluateHandler {

	public getModel(): EObject {
		let model = this.controller.getModel();
		if (model instanceof VariableField) {
			return model.getVariable();
		}
		let controller = functions.getAncestorByModelClass(this.controller, VariableField);
		let field = <VariableField>controller.getModel();
		return field.getVariable();
	}

}
