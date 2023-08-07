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
import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import EObjectController from "webface/wef/base/EObjectController";

import XTraining from "malang/model/XTraining";
import MalangPackage from "malang/model/MalangPackage";

import * as directors from "malang/directors";

import TrainingDesignView from "malang/view/design/TrainingDesignView";

import TrainingChangeRequest from "malang/requests/design/TrainingChangeRequest";

export abstract class TrainingDesignController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		this.installRequestHandler(TrainingChangeRequest.REQUEST_NAME, new TrainingChangeHandler(this));
	}

	public getView(): TrainingDesignView {
		return <TrainingDesignView>super.getView();
	}

	public getModel(): XTraining {
		return <XTraining>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
		this.refreshAvailableNames();
	}

	private refreshName(): void {
		let model = this.getModel();
		let eClass = model.eClass();
		let nameWithoutPackage = eClass.getNameWithoutPackage();
		let nameWithoutX = nameWithoutPackage.substring(1);
		let view = this.getView();
		view.setName(nameWithoutX);
	}

	private refreshAvailableNames(): void {
		let ePackage = MalangPackage.eINSTANCE;
		let eClassNames = ePackage.getEClassNames();
		let namespace = ePackage.getNamespaces()[0];
		let namespaceLength = namespace.name.length + 4;
		let names = new Map<string, string>();
		for (let eClassName of eClassNames) {
			let eClass = ePackage.getDefinedEClass(eClassName);
			if (XTraining.isPrototypeOf(eClass)) {
				let name = eClassName.substring(namespaceLength);
				names.set(name, eClassName);
			}
		}
		let view = this.getView();
		view.setAvailableNames(names);
	}

}

export default TrainingDesignController

class TrainingChangeHandler extends BaseHandler {

	public handle(request: TrainingChangeRequest, _callback: (data?: any) => void): void {
		let eClassName = request.getStringData(TrainingChangeRequest.MODEL);
		let oldModel = <XTraining>this.controller.getModel();
		let eClass = oldModel.eClass();
		if (eClass.getName() !== eClassName) {
			let director = directors.getDesignPartDirector(this.controller);
			let newModel = director.createByEClassName(eClassName);
			let command = new ReplaceCommand();
			command.setModel(oldModel);
			command.setReplacement(newModel);
			this.controller.execute(command);
		}
	}

}