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
import EList from "webface/model/EList";
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";
import EAttribute from "webface/model/EAttribute";

import VegazooPackage from "vegazoo/model/VegazooPackage";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

export abstract class Projector {

	public abstract transform(oldModel: XTopLevelSpec): XTopLevelSpec;

	protected projectFeature(oldModel: EObject, feature: EFeature, newModel: EObject): void {
		let value = oldModel.eGet(feature);
		newModel.eSet(feature, value)
	}

	protected projectReference(oldModel: EObject, oldFeature: EFeature,
		newModel: EObject, newFeature: EFeature, eClassName?: string): void {

		let oldValue = <EObject>oldModel.eGet(oldFeature);
		let newValue = oldValue;
		if (eClassName !== undefined && oldValue !== null) {

			let instance = VegazooPackage.eINSTANCE;
			let eClass: any = instance.getEClass(eClassName);
			newValue = <EObject>(new eClass());

			let newSubFeatures = newValue.eFeatures();
			let oldSubFeatures = oldValue.eFeatures();
			for (let oldSubFeature of oldSubFeatures) {

				for (let newSubFeature of newSubFeatures) {
					if (newSubFeature.getName() === oldSubFeature.getName()) {

						if (newSubFeature instanceof EAttribute) {
							this.projectFeature(oldValue, newSubFeature, newValue);
						} else {
							this.projectReference(oldValue, oldSubFeature, newValue, newSubFeature);
						}
						break;
					}
				}
			}
		}
		newModel.eSet(newFeature, newValue)
	}

	protected moveItems(source: EList<EObject>, target: EList<EObject>): void {
		for (let item of source) {
			let copy = util.copy(item);
			target.add(copy);
		}
	}

}

export default Projector;