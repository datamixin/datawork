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
import EClass from "webface/model/EClass";
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import EFeature from "webface/model/EFeature";
import AdapterList from "webface/model/AdapterList";
import * as constants from "webface/model/constants";
import Notification from "webface/model/Notification";
import Modification from "webface/model/Modification";
import ContentAdapter from "webface/model/ContentAdapter";
import ModelSynchronizer from "webface/model/ModelSynchronizer";

export default class BasicEObject extends EObject {

	private static IS = "is";
	private static GET = "get";
	private static SET = "set";

	private adapters: AdapterList = new AdapterList();
	private syncronizer: ModelSynchronizer = null;
	private features: EFeature[] = [];
	private classType: EClass = null;
	private container: EObject = null;
	private containingFeature: EFeature = null;

	constructor(eClass: EClass, eFeatures: EFeature[]) {
		super();
		this.classType = eClass;
		this.features = eFeatures;
	}

	public eClass(): EClass {
		return this.classType;
	}

	public eFeature(id: string): EFeature {
		for (let i = 0; i < this.features.length; i++) {
			let feature = this.features[i];
			if (feature.getName() === id) {
				return feature;
			}
		}
		return null;
	}

	public eFeatures(): EFeature[] {
		return this.features;
	}

	public eGet(feature: EFeature): any {
		let featureId = feature.getName();
		let capitalized = this.capitalized(featureId);
		if (this[BasicEObject.GET + capitalized] !== undefined) {
			return this[BasicEObject.GET + capitalized]();
		} else if (this[BasicEObject.IS + capitalized] !== undefined) {
			return this[BasicEObject.IS + capitalized]();
		} else {
			throw new Error("Missing method get or is for field " + featureId);
		}
	}

	public eSet(feature: EFeature, newValue: any): void {

		// Lepas value baru dari container sebelumnya.
		if (newValue instanceof EObject) {
			util.remove(newValue);
		}

		// Berikan value baru ke object ini.
		let featureId = feature.getName();
		let capitalized = this.capitalized(featureId);
		if (this[BasicEObject.SET + capitalized] !== undefined) {
			this[BasicEObject.SET + capitalized](newValue);
		} else {
			throw new Error("Missing method set for field " + featureId);
		}
	}

	private capitalized(name: string): string {
		return name[0].toUpperCase() + name.substring(1);
	}

	protected eSetNotify(feature: EFeature, oldValue: any, newValue: any): void {
		this.notify(Notification.SET, feature, oldValue, newValue);
	}

	public eAdapters(): AdapterList {
		return this.adapters;
	}

	public eContainer(): EObject {
		return this.container;
	}

	public eContainingFeature(): EFeature {
		return this.containingFeature;
	}

	public eSetSynchronizer(synchronizer: ModelSynchronizer): void {
		this.syncronizer = synchronizer;
	}

	public eGetSynchronizer(): ModelSynchronizer {
		return this.syncronizer;
	}

	public notify(eventType: number, feature: EFeature, oldValue: any, newValue: any, position?: number, key?: string): void {

		// Setting container dan featureId di old value menjadi null
		if (oldValue instanceof EObject) {
			let eObject = <EObject>oldValue;
			this.setContainerFeature(eObject, null, null);
		} else if (oldValue instanceof Array) {
			for (let i = 0; i < oldValue.length; i++) {
				let eObject = oldValue[i];
				if (eObject instanceof EObject) {
					this.setContainerFeature(eObject, null, null);
				}
			}
		}

		// Setting container dan featureId di new value
		if (newValue instanceof EObject) {
			let eObject = <EObject>newValue;
			this.setContainerFeature(eObject, this, feature);
		} else if (newValue instanceof Array) {
			for (let i = 0; i < newValue.length; i++) {
				let eObject = newValue[i];
				if (eObject instanceof EObject) {
					this.setContainerFeature(eObject, this, feature);
				}
			}
		}

		// Notification akan di berikan ke synchronizer dan adapters
		let notification = new Notification(this, eventType, feature, oldValue, newValue, position, key);

		// Lakukan syncronisasi di root container terlebih dahulu
		let rootContainer = <BasicEObject>util.getRootContainer(this);
		let syncronizer = rootContainer.eGetSynchronizer();
		if (syncronizer === null) {

			// Jika tidak ada syncronizer maka langsung notify
			this.notifyAdapters(notification);

		} else {

			// Notify setelah syncronize submit
			let modification = new Modification(notification);
			syncronizer.queue(modification, () => {
				this.notifyAdapters(notification);
			});
		}

	}

	private notifyAdapters(notification: Notification): void {

		// Harus di copy dulu adapter-nya karena daftar adapter dapat berubah selama proses
		let adapters = new AdapterList(this.adapters);

		// Lakukan notifikasi ke semua adapter
		for (let i = 0; i < adapters.size(); i++) {
			let adapter = adapters.get(i);

			// Hanya notify yang bukan content adapter
			if (!(adapter instanceof ContentAdapter)) {
				adapter.notifyChanged(notification);
			}
		}

		// Notify ke adapter yang extends ContentAdapter
		this.notifyContentAdapter(this, notification);
	}

	private notifyContentAdapter(eObject: EObject, notification: Notification): void {

		if (eObject !== null) {

			// Ambil daftar adapters
			let adapters = eObject["adapters"];
			for (let i = 0; i < adapters.size(); i++) {
				let adapter = adapters.get(i);

				// Notify content adapter yang ada di eObject ini
				if (adapter instanceof ContentAdapter) {
					adapter.notifyChanged(notification);
				}
			}

			// Notify content adapter yang ada di container
			let container = eObject["container"];
			this.notifyContentAdapter(container, notification);
		}
	}

	private setContainerFeature(eObject: EObject, container: EObject, feature: EFeature): void {

		// Berikan parent baru
		eObject[constants.CONTAINER] = container;
		eObject[constants.CONTAINING_FEATURE] = feature;
	}

}

