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
import Command from "webface/wef/Command";

import ViceReference from "vegazoo/model/ViceReference";
import VegazooPackage from "vegazoo/model/VegazooPackage";

export default class ViceReferenceUsedSetCommand extends Command {

	private reference: ViceReference = null;
	private oldValue: any = null;
	private newValue: any = null;
	private used: boolean = null;

	public setReference(scale: ViceReference): void {
		this.reference = scale;
	}

	public setUsed(used: boolean): void {
		this.used = used;
	}

	public execute(): void {
		let model = this.reference.getModel();
		let feature = this.reference.getReference();
		let ePackage = VegazooPackage.eINSTANCE;
		this.oldValue = model.eGet(feature);
		this.newValue = null;
		if (this.used === true) {

			let valueType: any = feature.getType();
			let types = ePackage.listEClasses();

			for (let type of types) {
				if (valueType === type) {

					// Reference define a concrete class
					this.newValue = <any>new valueType();
					break;
				}
			}

			// Looking for first concrete class
			for (let type of types) {
				let object = new type();
				if (valueType.prototype.isPrototypeOf(object)) {
					this.newValue = object;
					break;
				}
			}
		}

		model.eSet(feature, this.newValue);
	}

	public undo(): void {
		let model = this.reference.getModel();
		let feature = this.reference.getReference();
		model.eSet(feature, this.oldValue);
	}

	public redo(): void {
		let model = this.reference.getModel();
		let feature = this.reference.getReference();
		model.eSet(feature, this.newValue);
	}

}