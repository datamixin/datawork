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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import XEncoding from "vegazoo/model/XEncoding";
import XFieldDef from "vegazoo/model/XFieldDef";
import VegazooFactory from "vegazoo/model/VegazooFactory";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";

import { StandardType } from "vegazoo/constants";

import EncodingRemapper from "vegazoo/directors/templates/remappers/EncodingRemapper";

export abstract class ChannelEncodingRemapper implements EncodingRemapper {

	public remap(oldEncoding: XEncoding): XEncoding {

		// Buat mapping lama
		let factory = VegazooFactory.eINSTANCE;
		let newEncoding = factory.createFacetedEncoding();
		let oldMapping: { [name: string]: EObject } = {};
		let features = oldEncoding.eFeatures();
		for (let feature of features) {

			let oldName = feature.getName();
			let oldChannel = oldEncoding.eGet(feature);
			if (oldChannel !== null) {

				let newChannel = <EObject>util.copy(oldChannel);
				oldMapping[oldName] = newChannel;
			}
		}

		// Remap dan pasang mapping baru
		let newMapping = this.remapFeature(oldMapping);
		let newNames = Object.keys(newMapping);
		for (let newName of newNames) {
			let features = oldEncoding.eFeatures();
			for (let newFeature of features) {
				if (newName === newFeature.getName()) {
					let newChannel = newMapping[newName];
					if (newChannel !== null) {
						newEncoding.eSet(newFeature, newChannel);
					} else {
					}
					break;
				}
			}

		}

		return newEncoding;
	}

	abstract remapFeature(oldMapping: { [name: string]: EObject }): { [name: string]: EObject };

	protected mapField(oldMapping: { [name: string]: EObject }, newName: string,
		newMapping: { [name: string]: EObject }, types: StandardType[]): void {

		// Jika missing cari yang belum digunakan 
		let oldNames = Object.keys(oldMapping);
		let newNames = Object.keys(newMapping);
		for (let oldName of oldNames) {
			if (newNames.indexOf(oldName) === -1) {

				// Cari sesuai tipe yang diinginkan
				let oldChannel = oldMapping[oldName];
				if (oldChannel instanceof XFieldDef) {
					if (oldChannel instanceof XPositionFieldDef) {
						for (let type of types) {
							if (type === oldChannel.getType()) {
								newMapping[newName] = oldChannel;
								delete oldMapping[oldName];
								return;
							}
						}
					}
				}

				// Jika sesuai tipe juga tidak ada maka ambil apa adanya
				if (newMapping[newName] === undefined) {
					newMapping[newName] = oldChannel;
					delete oldMapping[oldName];
					return;
				}
			}
		}

		if (newMapping[newName] === undefined) {
			let factory = VegazooFactory.eINSTANCE;
			let fieldDef = factory.createPositionFieldDef();
			newMapping[newName] = fieldDef;
		}
	}

}

export default ChannelEncodingRemapper;