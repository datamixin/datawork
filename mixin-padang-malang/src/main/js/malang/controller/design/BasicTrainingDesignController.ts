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
import Notification from "webface/model/Notification";

import * as bekasi from "bekasi/directors";

import XBasicTraining from "malang/model/XBasicTraining";

import BasicTrainingDesignView from "malang/view/design/BasicTrainingDesignView";

import TrainingDesignController from "malang/controller/design/TrainingDesignController";

export default class BasicTrainingDesignController extends TrainingDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): BasicTrainingDesignView {
		return new BasicTrainingDesignView(this);
	}

	public getView(): BasicTrainingDesignView {
		return <BasicTrainingDesignView>super.getView();
	}

	public getModel(): XBasicTraining {
		return <XBasicTraining>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let estimator = model.getEstimator();
		return [estimator];
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
			if (feature === XBasicTraining.FEATURE_ESTIMATOR) {
				this.refreshChildren();
			}
		}
	}

}
