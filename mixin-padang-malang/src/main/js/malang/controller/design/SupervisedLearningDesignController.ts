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

import * as bekasi from "bekasi/directors";

import XSupervisedLearning from "malang/model/XSupervisedLearning";

import SupervisedLearningDesignView from "malang/view/design/SupervisedLearningDesignView";

import LearningDesignController from "malang/controller/design/LearningDesignController";

export default class SupervisedLearningDesignController extends LearningDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): SupervisedLearningDesignView {
		return new SupervisedLearningDesignView(this);
	}

	public getView(): SupervisedLearningDesignView {
		return <SupervisedLearningDesignView>super.getView();
	}

	public getModel(): XSupervisedLearning {
		return <XSupervisedLearning>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let preprocessing = model.getPreprocessing();
		let validation = model.getValidation();
		let training = model.getTraining();
		return [preprocessing, validation, training];
	}

	public refreshChildren(): void {
		super.refreshChildren();
		this.relayout()
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XSupervisedLearning.FEATURE_TRAINING) {
				this.refreshChildren();
			}
		}
	}

}
