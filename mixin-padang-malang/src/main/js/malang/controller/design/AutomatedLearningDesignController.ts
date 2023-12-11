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

import XAutomatedLearning from "malang/model/XAutomatedLearning";

import AutomatedLearningDesignView from "malang/view/design/AutomatedLearningDesignView";

import LearningDesignController from "malang/controller/design/LearningDesignController";

export default class AutomatedLearningDesignController extends LearningDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): AutomatedLearningDesignView {
		return new AutomatedLearningDesignView(this);
	}

	public getView(): AutomatedLearningDesignView {
		return <AutomatedLearningDesignView>super.getView();
	}

	public getModel(): XAutomatedLearning {
		return <XAutomatedLearning>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let task = model.getTask();
		let library = model.getLibrary();
		return [task, library];
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
			if (feature === XAutomatedLearning.FEATURE_TASK) {
				this.refreshChildren();
			} else if (feature === XAutomatedLearning.FEATURE_LIBRARY) {
				this.refreshChildren();
			}
		}
	}

}
