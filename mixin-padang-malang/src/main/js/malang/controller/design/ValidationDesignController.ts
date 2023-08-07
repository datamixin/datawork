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
import EObjectController from "webface/wef/base/EObjectController";

import XValidation from "malang/model/XValidation";
import MalangPackage from "malang/model/MalangPackage";

import ValidationDesignView from "malang/view/design/ValidationDesignView";

export abstract class ValidationDesignController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public getView(): ValidationDesignView {
		return <ValidationDesignView>super.getView();
	}

	public getModel(): XValidation {
		return <XValidation>super.getModel();
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
			if (XValidation.isPrototypeOf(eClass)) {
				let name = eClassName.substring(namespaceLength);
				names.set(name, eClassName);
			}
		}
		let view = this.getView();
		view.setAvailableNames(names);
	}

}

export default ValidationDesignController
