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
import * as wef from "webface/wef";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ObjectMap from "webface/util/ObjectMap";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Controller from "webface/wef/Controller";

import BasePartViewer from "webface/wef/base/BasePartViewer";
import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import * as bekasi from "bekasi/directors";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";

import FileReconcileApplier from "bekasi/directors/FileReconcileApplier";

import XBuilder from "padang/model/XBuilder";

import * as directors from "padang/directors";

import BuilderPremise from "padang/ui/BuilderPremise";
import ProjectComposer from "padang/ui/ProjectComposer";
import PreformPartViewer from "padang/ui/PreformPartViewer";
import AnatomyPartViewer from "padang/ui/AnatomyPartViewer";
import ExplainPartViewer from "padang/ui/ExplainPartViewer";

import StructureRegistry from "padang/directors/structures/StructureRegistry";

import BaseFieldDragDirector from "padang/directors/BaseFieldDragDirector";
import BasePrefaceDragDirector from "padang/directors/BasePrefaceDragDirector";
import BaseVariableFieldDirector from "padang/directors/BaseVariableFieldDirector";

import AnatomyControllerFactory from "padang/controller/anatomy/AnatomyControllerFactory";
import ExplainControllerFactory from "padang/controller/explain/ExplainControllerFactory";

/**
 * Ber-induk ke ProjectComposer karena harus menerima reconcile.
 */
export default class BuilderComposer extends BasePartViewer implements FullDeckPanel {

	private static ANATOMY_WIDTH = 300;
	private static EXPLAIN_HEIGHT = 320;

	private builder: XBuilder = null;
	private composite: Composite = null;

	private preformPartViewer: PreformPartViewer = null;
	private anatomyPartViewer = new AnatomyPartViewer();
	private explainPartViewer = new ExplainPartViewer();

	private reconcileAppliers = new ObjectMap<FileReconcileApplier>();

	constructor(premise: BuilderPremise) {
		super();
		this.builder = <XBuilder>premise.getModel();
		this.anatomyPartViewer.setParent(this);
		this.explainPartViewer.setParent(this);
		this.preparePreformPartViewer(premise);

		this.registerFieldDragDirector();
		this.registerPrefaceDragDirector();
		this.registerVariableFieldDirector();
	}

	private preparePreformPartViewer(premise: BuilderPremise): void {
		let registry = StructureRegistry.getInstance();
		let name = this.builder.getStructure();
		let structure = registry.get(name);
		this.preformPartViewer = structure.createPartViewer(premise);
		this.preformPartViewer.setParent(this);
	}

	private registerFieldDragDirector(): void {
		let director = new BaseFieldDragDirector(this);
		this.registerDirector(directors.FIELD_DRAG_DIRECTOR, director);
	}

	private registerPrefaceDragDirector(): void {
		let director = new BasePrefaceDragDirector(this);
		this.registerDirector(directors.PREFACE_DRAG_DIRECTOR, director);
	}

	private registerVariableFieldDirector(): void {
		let key = directors.VARIABLE_FIELD_DIRECTOR;
		this.registerDirector(key, new BaseVariableFieldDirector(this.anatomyPartViewer));
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("builder-composer");
		element.css("background", "#F8F8F8");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createPreformPartViewer(this.composite);
		this.createAnatomyPartViewer(this.composite);
		this.createExplainPartViewer(this.composite);
	}

	private createPreformPartViewer(parent: Composite): void {

		this.preformPartViewer.createControl(parent);
		let control = this.preformPartViewer.getControl();

		let layoutData = new GridData(true, true);
		layoutData.verticalSpan = 2;
		control.setLayoutData(layoutData);
	}

	private createAnatomyPartViewer(parent: Composite): void {

		this.anatomyPartViewer.createControl(parent);
		let control = this.anatomyPartViewer.getControl();

		let layoutData = new GridData(BuilderComposer.ANATOMY_WIDTH, true);
		control.setLayoutData(layoutData);
	}

	private createExplainPartViewer(parent: Composite): void {

		this.explainPartViewer.createControl(parent);
		let control = this.explainPartViewer.getControl();

		let layoutData = new GridData(BuilderComposer.ANATOMY_WIDTH, BuilderComposer.EXPLAIN_HEIGHT);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.preformPartViewer.configure();
		this.anatomyPartViewer.setControllerFactory(new AnatomyControllerFactory());
		this.explainPartViewer.setControllerFactory(new ExplainControllerFactory());
	}

	public getTitle(): string {
		return "Builder";
	}

	public postOpen(): void {
		this.configure();
		this.wirePartViewers();
		this.populateContents();
		this.preformPartViewer.postOpen();
	}

	private wirePartViewers(): void {
		this.wireAnatomyExplain();
	}

	private wireAnatomyExplain(): void {
		let director = wef.getSelectionDirector(this.anatomyPartViewer);
		let listener = new AnatomySelectionChangedListener(this.explainPartViewer);
		director.addSelectionChangedListener(listener);
	}

	private populateContents(): void {
		this.anatomyPartViewer.setContents(this.builder);
	}

	private getProjectComposer(): ProjectComposer {
		return <ProjectComposer>this.getParent();
	}

	private getFileId(): string {
		let composer = this.getProjectComposer();
		return composer.getFileId();
	}

	public getControl(): Control {
		return this.composite;
	}

	public postClose(_result: string, callback: () => void): void {
		callback();
	}

	public preClose(): void {
		this.unregisterAppliers();
		this.clearContents();
	}

	private unregisterAppliers(): void {
		let fileId = this.getFileId();
		let director = bekasi.getReconcileDirector(this);
		let keys = this.reconcileAppliers.keySet();
		for (let key of keys) {
			let applier = this.reconcileAppliers.get(key);
			director.unregisterFileApplierSpecific(key, fileId, applier);
		}
	}

	private clearContents(): void {
		this.resetViewer(this.anatomyPartViewer)
	}

	private resetViewer(viewer: BaseControllerViewer): void {
		let controller = viewer.getRootController();
		controller.setContents(null);
	}

}

class AnatomySelectionChangedListener implements SelectionChangedListener {

	private explainPartViewer: ExplainPartViewer = null;

	constructor(explainPartViewer: ExplainPartViewer) {
		this.explainPartViewer = explainPartViewer;
	}

	public selectionChanged(event: SelectionChangedEvent): void {
		let selection = event.getSelection();
		if (!selection.isEmpty()) {
			let controller = <Controller>selection.getFirstElement();
			let model = controller.getModel();
			this.explainPartViewer.setContents(model);
		} else {
			this.explainPartViewer.resetContents();
		}
	}

}
