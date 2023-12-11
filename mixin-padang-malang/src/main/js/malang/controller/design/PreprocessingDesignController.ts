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
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import * as directors from "malang/directors";

import XPreprocessing from "malang/model/XPreprocessing";

import PreprocessingDesignView from "malang/view/design/PreprocessingDesignView";

import PreprocessingModifyRequest from "malang/requests/design/PreprocessingModifyRequest";

export default class PreprocessingDesignController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		this.installRequestHandler(PreprocessingModifyRequest.REQUEST_NAME, new PreprocessingModifyHandler(this));
	}

	public createView(): PreprocessingDesignView {
		return new PreprocessingDesignView(this);
	}

	public getView(): PreprocessingDesignView {
		return <PreprocessingDesignView>super.getView();
	}

	public getModel(): XPreprocessing {
		return <XPreprocessing>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshRecipe();
		this.refreshModify();
	}

	private refreshRecipe(): void {
		let director = directors.getDesignPartDirector(this);
		let modifier = director.createRecipeModifier();
		let steps = modifier.getMutationSteps();
		let view = this.getView();
		view.setMutationSteps(steps);
	}

	private refreshModify(): void {
		let model = this.getModel();
		let recipe = model.getRecipe();
		let view = this.getView();
		view.setModifyEnabled(recipe !== null);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {

		let eventType = notification.getEventType();
		if (eventType === Notification.SET) {

			let feature = notification.getFeature();
			if (feature === XPreprocessing.FEATURE_RECIPE) {

				let model = this.getModel();
				let director = directors.getPreprocessingDirector(this);
				director.preparePreprocessingVariable(model, () => {

					this.refreshVisuals();
					this.relayout();

				});
			}
		}
	}

}

class PreprocessingModifyHandler extends BaseHandler {

	public handle(_request: PreprocessingModifyRequest, _callback: (data?: any) => void): void {
		let preprocessing = <XPreprocessing>this.controller.getModel();
		let director = directors.getPreprocessingDirector(this.controller);
		director.openPreprocessingComposer(this.controller, preprocessing);
	}

}