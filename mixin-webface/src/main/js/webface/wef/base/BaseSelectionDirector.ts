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
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";
import SelectionPart from "webface/wef/SelectionPart";
import SelectionDirector from "webface/wef/SelectionDirector";
import { SelectionParticipant, SELECTION_PARTICIPANT } from "webface/wef/SelectionParticipant";

import Selection from "webface/viewers/Selection";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import BaseParticipantCollector from "webface/wef/base/BaseParticipantCollector";

export default class BaseSelectionDirector implements SelectionDirector {

	private collector: BaseParticipantCollector<SelectionParticipant>;
	private selection: Controller[] = [];
	private listeners: SelectionChangedListener[] = [];

	constructor(partViewer: PartViewer) {
		let key = SELECTION_PARTICIPANT;
		this.collector = new BaseParticipantCollector<SelectionParticipant>(key, partViewer);
	}

	public select(controller: Controller): void {
		if (this.selection.indexOf(controller) === -1) {
			this.collector.collect();
			this.deselectAll();
			this.selection = [controller];
			this.doSelect(controller, true);
			this.notifyListeners();
		}
	}

	private doSelect(controller: Controller, selected: boolean): void {

		// Berikan selection dan status-nya ke semua participant
		let participants = this.collector.getParticipants();
		for (let i = 0; i < participants.length; i++) {
			let participant = participants[i];
			let target = participant.getController();
			if (target === controller) {
				participant.setControllerSelected(selected);
			}
			participant.setSelected(controller, selected);
		}

		// View harus implement SelectionPart untuk otomatis di set selection
		let part = <SelectionPart><any>controller.getView();
		if (part.setSelected !== undefined) {
			part.setSelected(selected);
		}

	}

	public clear(): void {
		this.deselectAll();
		this.notifyListeners();
	}

	private deselectAll(): void {
		for (var i = 0; i < this.selection.length; i++) {
			let controller = this.selection[i];
			this.doSelect(controller, false);
		}
		this.selection = [];
	}

	public setSelection(selection: Selection): void {
		let array = selection.toArray();
		for (var i = 0; i < this.selection.length; i++) {
			let controller = this.selection[i];
			if (array.indexOf(controller) === -1 && controller instanceof Controller) {
				this.doSelect(controller, false);
			}
		}

		// Isikan selection.
		this.selection = [];
		for (var i = 0; i < array.length; i++) {
			this.selection.push(array[i]);
		}

		this.notifyListeners();
	}

	public getSelection(): Selection {
		return new Selection(this.selection);
	}

	public addSelectionChangedListener(listener: SelectionChangedListener): void {
		if (this.listeners.indexOf(listener) === -1) {
			this.listeners.push(listener);
		}
	}

	public removeSelectionChangedListener(listener: SelectionChangedListener): void {
		let index = this.listeners.indexOf(listener);
		if (index !== -1) {
			this.listeners.splice(index);
		}
	}

	protected notifyListeners(): void {
		let event = new SelectionChangedEvent(this, this.getSelection());
		for (var i = 0; i < this.listeners.length; i++) {
			let listener = this.listeners[i];
			listener.selectionChanged(event);
		}
	}

}
