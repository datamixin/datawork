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
import EObject from "webface/model/EObject";
import Modification from "webface/model/Modification";
import ModelSynchronizer from "webface/model/ModelSynchronizer";

export abstract class BaseModelSynchronizer implements ModelSynchronizer {

	private model: EObject = null;
	private tasks: SynchronizerTask[] = [];
	private callbacks: (() => void)[] = [];

	constructor(model: EObject) {
		this.model = model;
	}

	public getModel(): EObject {
		return this.model;
	}

	public queue(modification: Modification, callback: () => void): void {
		this.tasks.push(new SynchronizerTask(modification, callback));
	}

	/**
	 * Kirim semua daftar modifikasi sesuai urutan. 
	 */
	public commit(): void {

		// Potong tasks dan callback yang ada sekarang untuk memisahkan dari yang baru
		let tasks = this.tasks.splice(0, this.tasks.length);
		let userCallbacks = this.callbacks.splice(0, this.callbacks.length);

		let counter = 0;
		let taskCallbacks: (() => void)[] = [];
		for (let task of tasks) {

			// Submit semua task sampai selesai
			this.submit(task.modification, () => {

				taskCallbacks.push(task.callback);

				counter++;
				if (counter === tasks.length) {

					// Jalankan semua task callback yang terdaftar selama commit
					for (let callback of taskCallbacks) {
						callback();
					}

					// Jalankan semua user callback yang terdaftar saat awal commit
					for (let callback of userCallbacks) {
						callback();
					}

				}
			});
		}
	}

	public addOnCommit(callback: () => void): void {
		if (this.callbacks.indexOf(callback) === -1) {
			this.callbacks.push(callback);
		}
	}

	/**
	 * Kirim modification
	 * @param modification
	 * @param callback
	 */
	protected abstract submit(modification: Modification, callback: () => void): void;

}

class SynchronizerTask {

	constructor(
		public modification: Modification,
		public callback: () => void) {
	}
}

export default BaseModelSynchronizer;
