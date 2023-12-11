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
import View from "webface/wef/View";
import Command from "webface/wef/Command";
import Participant from "webface/wef/Participant";
import BaseConductor from "webface/wef/BaseConductor";
import RootController from "webface/wef/RootController";
import ControllerViewer from "webface/wef/ControllerViewer";

/**
 * Controller di design pattern MVC (Lihat EditPart di GEF):<br>
 * 1. Memegang model dan view (Mediating Controller)
 * 1. Memanggil view.createControl() untuk membuat view.
 * 1. Setting view jika dibutuhkan
 * 1. Tidak mengandung rutin UI karena semua urusan view, hanya sebagai target bagi View
 * 1. Akses ke back-end jika dibutuhkan
 * 1. Buat anakan melalui getModelChildren()
 * 
 * Untuk tambahan lihat:
 * https://developer.apple.com/library/mac/documentation/General/Conceptual/CocoaEncyclopedia/Model-View-Controller/Model-View-Controller.html
 */
export abstract class Controller extends BaseConductor {

	protected static FLAG_ACTIVE = 1;

	private parent: Controller = null;
	private children: Controller[] = [];
	private model: any = null;
	private flags: number = 0;
	private view: View = null;
	private participants: { [participantKey: string]: Participant[] } = {};

	public setParent(parent: Controller): void {
		this.parent = parent;
	}

	public getParent(): Controller {
		return this.parent;
	}

	protected getFlag(flag: number): boolean {
		return (this.flags & flag) !== 0;
	}

	protected setFlag(flag: number, value: boolean): void {
		if (value === true) {
			this.flags |= flag;
		} else {
			this.flags &= ~flag;
		}
	}

	public setModel(model: any): void {
		this.model = model;
	}

	public getModel(): any {
		return this.model;
	}

	protected setView(view: View): void {
		this.view = view;
	}

	public getView(): View {
		if (this.view === null) {
			let view = this.createView();
			this.setView(view);
		}
		return this.view;
	}

	public getChildren(): Controller[] {
		return this.children;
	}

	protected addChild(child: Controller, index: number): void {

		this.children.splice(index, 0, child)
		child.setParent(this);

		// Persiapkan semua request handler sebelum child ditampilkan
		child.createRequestHandlers();

		// View di controller ini dibuat lebih dahulu dibuat sebelum anakannya.
		this.addChildVisual(child, index);
		child.addNotify();

		if (this.isActive() === true && this.parent !== null) {
			child.activate();
		}
	}

	protected removeChild(child: Controller): void {

		let children = this.getChildren();
		let index = children.indexOf(child);
		if (index < 0) {
			return;
		}
		child.deactivate();
		child.removeNotify();

		this.removeChildVisual(child);
		child.setParent(null);
		children.splice(index, 1);
	}

	protected reorderChild(controller: Controller, index: number): void {

		let children = this.getChildren();
		let oldIndex = children.indexOf(controller);
		children.splice(oldIndex, 1);
		children.splice(index, 0, controller);

		this.moveChildVisual(controller, index);
	}

	private addChildVisual(controller: Controller, index: number): void {
		let child = controller.getView();
		let view = this.getView();
		view.addView(child, index);
	}

	private removeChildVisual(controller: Controller): void {
		let child = controller.getView();
		let view = this.getView();
		view.removeView(child);
	}

	private moveChildVisual(controller: Controller, index: number): void {
		let child = controller.getView();
		let view = this.getView();
		view.moveView(child, index);
	}

	public addNotify(): void {
		for (var i = 0; i < this.children.length; i++) {
			let child = this.children[i];
			child.addNotify();
		}
		this.refresh();
	}

	public removeNotify(): void {
		let children = this.getChildren();
		for (var i = 0; i < children.length; i++) {
			children[i].removeNotify();
		}
	}

	public refresh(): void {
		this.refreshChildren();
		this.refreshVisuals();
	}

	protected isEquals(model: any, other: any) {
		return model === other;
	}

	private removeNulls(children: any[]): any[] {
		let list: any[] = [];
		for (let child of children) {
			if (child !== null) {
				list.push(child);
			}
		}
		return list;
	}

	protected refreshChildren(): void {

		let modelChildren = this.getModelChildren();
		let modelObjects = this.removeNulls(modelChildren);
		let children = this.getChildren();
		let size = children.length;

		for (var i = 0; i < modelObjects.length; i++) {

			let model = modelObjects[i];

			// Do a quick check to see if editPart[i] == model[i]
			if (i < children.length && this.isEquals(children[i].getModel(), model)) {
				continue;
			}

			// Look to see if the EditPart is already around but in the wrong location
			let controller: Controller = null;
			if (size > 0) {
				for (var j = 0; j < children.length; j++) {
					let child = children[j];
					if (this.isEquals(child.getModel(), model)) {
						controller = child;
						break;
					}
				}
			}

			if (controller !== null) {
				this.reorderChild(controller, i);
			} else {
				// An EditPart for this model doesn't exist yet. Create and insert one.
				controller = this.createChild(model);
				this.addChild(controller, i);
			}

		}

		// remove the remaining EditParts
		size = children.length;
		if (i < size) {
			let trash: Controller[] = [];
			for (; i < size; i++)
				trash.push(children[i]);
			for (i = 0; i < trash.length; i++) {
				let tobeRemove = trash[i];
				this.removeChild(tobeRemove);
			}
		}

	}

	public getViewer(): ControllerViewer {
		let root = this.getRoot();
		if (root === null) {
			return null;
		}
		return root.getViewer();
	}

	public getRoot(): RootController {
		let parent = this.getParent();
		if (parent !== null) {
			return parent.getRoot();
		}
		return null;
	}

	private createChild(model: any): Controller {
		let viewer = this.getViewer();
		let factory = viewer.getControllerFactory();
		return factory.createController(model);
	}

	public execute(command: Command): void {
		if (command !== null) {
			let viewer = this.getViewer();
			let rootViewer = viewer.getRootViewer();
			let editDomain = rootViewer.getEditDomain();
			let commandStack = editDomain.getCommandStack();
			commandStack.execute(command);
		}
	}

	public addParticipant(participantKey: string, participant: Participant): void {
		if (this.participants[participantKey] === undefined) {
			this.participants[participantKey] = [];
		}
		let list = this.participants[participantKey];
		list.push(participant);
	}

	public hasParticipant(participantKey: string): boolean {
		return this.participants[participantKey] !== undefined;
	}

	public getParticipants(participantKey: string): Participant[] {
		if (this.hasParticipant(participantKey)) {
			return this.participants[participantKey];
		}
		return [];
	}

	/**
	 * Override method ini untuk mamasang listener
	 */
	protected activate(): void {
		this.setFlag(Controller.FLAG_ACTIVE, true);
		let children = this.getChildren();
		for (var i = 0; i < children.length; i++) {
			children[i].activate();
		}
	}

	/**
	 * Override method ini untuk menghapus listener
	 */
	protected deactivate(): void {
		let children = this.getChildren();
		for (var i = 0; i < children.length; i++) {
			children[i].deactivate();
		}
		this.setFlag(Controller.FLAG_ACTIVE, false);
	}

	public isActive(): boolean {
		return this.getFlag(Controller.FLAG_ACTIVE);
	}

	/**
	 * Override method untuk menginstall assistant dengan #installRequestHandler.
	 */
	protected createRequestHandlers(): void {

	}

	/**
	 * Method ini harus di implement untuk dapat menampilkan view.
	 */
	public abstract createView(): View;

	/**
	 * Lakukan proses pembaharuan view.
	 */
	protected refreshVisuals(): void {

	}

	/**
	 * Override method ini jika controller memiliki anakan.
	 */
	protected getModelChildren(): any[] {
		return [];
	}

	public noticeProblem(problem: any): void {

	}

}

export default Controller;