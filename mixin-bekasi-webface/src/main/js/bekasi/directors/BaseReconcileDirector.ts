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
import Map from "webface/util/ObjectMap";
import * as functions from "webface/util/functions";
import { jsonLeanFactory } from "webface/constants";

import Reconcile from "bekasi/reconciles/Reconcile";
import GroupReconcile from "bekasi/reconciles/GroupReconcile";
import RunspaceReconcile from "bekasi/reconciles/RunspaceReconcile";
import FileReconcile from "bekasi/reconciles/FileReconcile";

import ReconcileDirector from "bekasi/directors/ReconcileDirector";
import FileReconcileApplier from "bekasi/directors/FileReconcileApplier";
import RunspaceReconcileApplier from "bekasi/directors/RunspaceReconcileApplier";

export default class BaseReconcileDirector implements ReconcileDirector {

	private runspaceAppliers = new Map<RunspaceReconcileApplier>();
	private fileAppliers = new Map<Map<FileReconcileApplier[]>>();

	constructor(space: string, closeCallback: (code: number) => void) {
		this.prepareService(space, closeCallback);
	}

	private prepareService(space: string, closeCallback: (code: number) => void) {

		reconcileSingleton.setReconcileCallback((reconcile: Reconcile) => {
			if (reconcile instanceof GroupReconcile) {
				let reconciles = reconcile.getReconciles();
				for (let i = 0; i < reconciles.length; i++) {
					let element = reconciles[i];
					this.reconcile(element);
				}
			} else {
				this.reconcile(reconcile);
			}
		});

		reconcileSingleton.setOncloseCallback(closeCallback);

		if (!reconcileSingleton.isConnected()) {
			reconcileSingleton.connect(space);
		}
	}

	private reconcile(reconcile: Reconcile): void {

		let leanName = reconcile.xLeanName();
		if (reconcile instanceof FileReconcile) {

			if (this.fileAppliers.containsKey(leanName)) {
				let appliers = this.fileAppliers.get(leanName);
				let fileId = reconcile.getFileId();
				if (appliers.containsKey(fileId)) {
					let list = appliers.get(fileId);
					for (let applier of list) {
						applier.apply(reconcile);
					}
				}
			}

		} else if (reconcile instanceof RunspaceReconcile) {

			let applier = this.runspaceAppliers.get(leanName);
			applier.apply(reconcile);
		}
	}

	public registerRunspaceApplier(leanName: string, applier: FileReconcileApplier): void {
		this.runspaceAppliers.put(leanName, applier);
	}

	public registerFileApplier(leanName: string, fileId: string, applier: FileReconcileApplier): void {
		if (!this.fileAppliers.containsKey(leanName)) {
			this.fileAppliers.put(leanName, new Map<[FileReconcileApplier]>());
		}
		let appliers = this.fileAppliers.get(leanName);
		if (!appliers.containsKey(fileId)) {
			let list: FileReconcileApplier[] = [];
			appliers.put(fileId, list);
		}
		let list = appliers.get(fileId);
		list.push(applier);
	}

	public unregisterFileApplier(leanName: string, fileId: string): void {
		let appliers = this.fileAppliers.get(leanName);
		appliers.remove(fileId);
	}

	public unregisterFileApplierSpecific(leanName: string, fileId: string, applier: FileReconcileApplier): void {
		let appliers = this.fileAppliers.get(leanName);
		if (appliers.containsKey(fileId)) {
			let list = appliers.get(fileId);
			let index = list.indexOf(applier);
			if (index >= 0) {
				list.splice(index, 1);
			}
		}
	}
}

class ReconcileService {

	private static instance: ReconcileService = new ReconcileService();

	private oncloseCallback: (code: number) => void = () => { };
	private socket: WebSocket = null;
	private reconcileCallback = (_reconcile: Reconcile) => { };

	constructor() {
		if (ReconcileService.instance) {
			throw new Error("Error: Instantiation failed: Use ReconcileService.getInstance() instead of new");
		}
		ReconcileService.instance = this;
	}

	public static getInstance(): ReconcileService {
		return ReconcileService.instance;
	}

	public isConnected(): boolean {
		return this.socket !== null && this.socket.readyState === this.socket.OPEN;
	}

	public connect(space: string): void {

		let protocols = { "https:": "wss:", "http:": "ws:" };
		let url = functions.getParentURL("websocket/reconciler/", protocols)
		this.socket = new WebSocket(url + space);

		this.socket.onopen = (_session) => {
		};

		this.socket.onerror = (event) => {
			console.error("Websocket Error", JSON.stringify(event, ["message", "arguments", "type", "name"]));
		};

		this.socket.onmessage = (message) => {
			let text = message.data;
			let json = JSON.parse(text);
			let reconcile = <Reconcile>jsonLeanFactory.create(json);
			this.reconcileCallback(reconcile);
		};

		this.socket.onclose = (event: CloseEvent) => {
			let code = event.code;
			this.oncloseCallback(code);
		};
	}

	public setReconcileCallback(callback: (reconcile: Reconcile) => void): void {
		this.reconcileCallback = callback;
	}

	public setOncloseCallback(callback: (code: number) => void): void {
		this.oncloseCallback = callback;
	}

}

let reconcileSingleton = ReconcileService.getInstance();

