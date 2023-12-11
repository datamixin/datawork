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
import * as wef from "webface/wef";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import EObject from "webface/model/EObject";
import * as util from "webface/model/util";

import GridData from "webface/layout/GridData";
import FillData from "webface/layout/FillData";
import GridLayout from "webface/layout/GridLayout";

import Controller from "webface/wef/Controller";
import EditDomain from "webface/wef/EditDomain";

import ArrayCommandStackDomain from "webface/wef/base/ArrayCommandStackDomain";
import BaseSynchronizationDirector from "webface/wef/base/BaseSynchronizationDirector";

import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import TaskKey from "bekasi/ui/TaskKey";
import ProjectSynchronizer from "padang/ui/ProjectSynchronizer";

import * as bekasi from "bekasi/directors";

import BaseComposer from "bekasi/ui/BaseComposer";

import IndicationReconcile from "bekasi/reconciles/IndicationReconcile";
import RectificationReconcile from "bekasi/reconciles/RectificationReconcile";

import FileReconcileApplier from "bekasi/directors/FileReconcileApplier";

import * as padang from "padang/padang";

import XCell from "padang/model/XCell";
import XSheet from "padang/model/XSheet";
import XProject from "padang/model/XProject";

import * as directors from "padang/directors";

import ToolboxPartViewer from "padang/ui/ToolboxPartViewer";
import ToolsetPartViewer from "padang/ui/ToolsetPartViewer";
import PresentPartViewer from "padang/ui/PresentPartViewer";
import OutlinePartViewer from "padang/ui/OutlinePartViewer";

import ControllerProperties from "padang/util/ControllerProperties";

import BaseCellDragDirector from "padang/directors/BaseCellDragDirector";
import BaseSheetDragDirector from "padang/directors/BaseSheetDragDirector";
import ProjectComposerDirector from "padang/directors/ProjectComposerDirector";
import BaseOutlinePartDirector from "padang/directors/BaseOutlinePartDirector";
import BasePresentPartDirector from "padang/directors/BasePresentPartDirector";
import BaseToolboxPartDirector from "padang/directors/BaseToolboxPartDirector";
import BaseQueryResultDirector from "padang/directors/BaseQueryResultDirector";
import BaseLetAuxiliaryDirector from "padang/directors/BaseLetAuxiliaryDirector";
import BaseColumnProfileDirector from "padang/directors/BaseColumnProfileDirector";
import BaseProjectExportDirector from "padang/directors/BaseProjectExportDirector";
import BaseOptionFormulaDirector from "padang/directors/BaseOptionFormulaDirector";
import BaseBuilderPresentDirector from "padang/directors/BaseBuilderPresentDirector";
import BaseGraphicPresentDirector from "padang/directors/BaseGraphicPresentDirector";
import BaseOutcomePresentDirector from "padang/directors/BaseOutcomePresentDirector";
import BaseDatasetPresentDirector from "padang/directors/BaseDatasetPresentDirector";
import BaseViewsetPresentDirector from "padang/directors/BaseViewsetPresentDirector";
import BaseProvisionResultDirector from "padang/directors/BaseProvisionResultDirector";
import BaseProjectRunextraDirector from "padang/directors/BaseProjectRunextraDirector";
import BaseExpressionFormulaDirector from "padang/directors/BaseExpressionFormulaDirector";

import IndicationReconcileApplier from "padang/ui/appliers/IndicationReconcileApplier";
import RectificationReconcileApplier from "padang/ui/appliers/RectificationReconcileApplier";

import ToolboxControllerFactory from "padang/controller/toolbox/ToolboxControllerFactory";
import ToolsetControllerFactory from "padang/controller/toolset/ToolsetControllerFactory";
import PresentControllerFactory from "padang/controller/present/PresentControllerFactory";
import OutlineControllerFactory from "padang/controller/outline/OutlineControllerFactory";

export default class ProjectComposer extends BaseComposer implements ProjectComposerDirector {

	private static TOOLBOX_WIDTH = 308;
	private static TOOLKIT_HEIGHT = 56;
	private static OUTLINE_WIDTH = 240;

	private editDomain: ArrayCommandStackDomain = null;
	private synchronizer: ProjectSynchronizer = null;

	private composite: Composite = null;
	private headPart: Composite = null;
	private bodyPart: Composite = null;
	private toolboxPartViewer = new ToolboxPartViewer();
	private toolsetPartViewer = new ToolsetPartViewer();
	private outlinePartViewer = new OutlinePartViewer();
	private presentPartViewer = new PresentPartViewer();

	constructor(key: TaskKey) {
		super(key);

		this.toolboxPartViewer.setParent(this);
		this.toolsetPartViewer.setParent(this);
		this.outlinePartViewer.setParent(this);
		this.presentPartViewer.setParent(this);

		this.registerCellDragDirector();
		this.registerSheetDragDirector();
		this.registerOutlinePartDirector();
		this.registerPresentPartDirector();
		this.registerToolboxPartDirector();
		this.registerQueryResultDirector();
		this.registerLetAuxiliaryDirector();
		this.registerOptionFormulaDirector();
		this.registerColumnProfileDirector();
		this.registerProjectExportDirector();
		this.registerBuilderPresentDirector();
		this.registerGraphicPresentDirector();
		this.registerOutcomePresentDirector();
		this.registerDatasetPresentDirector();
		this.registerViewsetPresentDirector();
		this.registerProjectComposerDirector();
		this.registerProvisionResultDirector();
		this.registerProjectRunextraDirector();
		this.registerExpressionFormulaDirector();
	}

	private registerCellDragDirector(): void {
		let director = new BaseCellDragDirector(this);
		this.registerDirector(directors.CELL_DRAG_DIRECTOR, director);
	}

	private registerSheetDragDirector(): void {
		let director = new BaseSheetDragDirector(this);
		this.registerDirector(directors.SHEET_DRAG_DIRECTOR, director);
	}

	private registerOutlinePartDirector(): void {
		let key = directors.OUTLINE_PART_DIRECTOR;
		this.registerDirector(key, new BaseOutlinePartDirector(this.outlinePartViewer));
	}

	private registerPresentPartDirector(): void {
		let key = directors.PRESENT_PART_DIRECTOR;
		this.registerDirector(key, new BasePresentPartDirector(this.presentPartViewer));
	}

	private registerToolboxPartDirector(): void {
		let key = directors.TOOLBOX_PART_DIRECTOR;
		this.registerDirector(key, new BaseToolboxPartDirector(this.toolboxPartViewer));
	}

	private registerBuilderPresentDirector(): void {
		let key = directors.BUILDER_PRESENT_DIRECTOR;
		this.registerDirector(key, new BaseBuilderPresentDirector(this.presentPartViewer));
	}

	private registerGraphicPresentDirector(): void {
		let key = directors.GRAPHIC_PRESENT_DIRECTOR;
		this.registerDirector(key, new BaseGraphicPresentDirector(this.presentPartViewer));
	}

	private registerOutcomePresentDirector(): void {
		let key = directors.OUTCOME_PRESENT_DIRECTOR;
		this.registerDirector(key, new BaseOutcomePresentDirector(this.presentPartViewer));
	}

	private registerDatasetPresentDirector(): void {
		let key = directors.DATASET_PRESENT_DIRECTOR;
		this.registerDirector(key, new BaseDatasetPresentDirector(this.presentPartViewer));
	}

	private registerViewsetPresentDirector(): void {
		let key = directors.VIEWSET_PRESENT_DIRECTOR;
		this.registerDirector(key, new BaseViewsetPresentDirector(this.presentPartViewer));
	}

	private registerQueryResultDirector(): void {
		let key = directors.QUERY_RESULT_DIRECTOR;
		this.registerDirector(key, new BaseQueryResultDirector());
	}

	private registerColumnProfileDirector(): void {
		let key = directors.COLUMN_PROFILE_DIRECTOR;
		this.registerDirector(key, new BaseColumnProfileDirector(this.presentPartViewer));
	}

	private registerProjectExportDirector(): void {
		let key = bekasi.EXPORT_DIRECTOR;
		this.registerDirector(key, new BaseProjectExportDirector());
	}

	private registerProjectComposerDirector(): void {
		this.registerDirector(directors.PROJECT_COMPOSER_DIRECTOR, this);
	}

	private registerProvisionResultDirector(): void {
		let key = directors.PROVISION_RESULT_DIRECTOR;
		this.registerDirector(key, new BaseProvisionResultDirector());
	}

	private registerProjectRunextraDirector(): void {
		let key = bekasi.RUNEXTRA_DIRECTOR;
		this.registerDirector(key, new BaseProjectRunextraDirector());
	}

	private registerLetAuxiliaryDirector(): void {
		let director = new BaseLetAuxiliaryDirector(this.presentPartViewer);
		this.registerDirector(directors.LET_AUXILIARY_DIRECTOR, director);
	}

	private registerOptionFormulaDirector(): void {
		let director = new BaseOptionFormulaDirector(this);
		this.registerDirector(directors.OPTION_FORMULA_DIRECTOR, director);
	}

	private registerExpressionFormulaDirector(): void {
		let director = new BaseExpressionFormulaDirector(this);
		this.registerDirector(directors.EXPRESSION_FORMULA_DIRECTOR, director);
	}

	protected prepareSynchronizer(model: EObject): void {

		this.synchronizer = new ProjectSynchronizer(this, model, () => {

			// Jadikan file committed menjadi false karena sudah modified
			let file = this.getFile();
			file.setCommitted(false);

			// Update project title
			let director = bekasi.getConsoleDirector(this);
			director.refreshFile(file);

		});

		model.eSetSynchronizer(this.synchronizer);
	}

	protected prepareEditDomain(): void {
		this.editDomain = new ArrayCommandStackDomain(this.synchronizer);
	}

	public getEditDomain(): EditDomain {
		return this.editDomain;
	}

	public getProject(): XProject {
		let model = <XProject>this.synchronizer.getModel();
		return model;
	}

	public getFileIcon(): string {
		return padang.FILE_ICON;
	}

	public isContained(model: EObject): boolean {
		let root = util.getRootContainer(model);
		return root instanceof XProject;
	}

	public activated(_state: boolean): void {

	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-project-composer");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createHeadPart(this.composite);
		this.createBodyPart(this.composite);
	}

	private createHeadPart(parent: Composite): void {

		this.headPart = new Composite(parent);

		let element = this.headPart.getElement();
		element.addClass("padang-project-composer-head-part");
		element.css("background-color", "#F8F8F8");
		element.css("border-bottom", "1px solid #D8D8D8");

		let layout = new GridLayout(2, 5, 4, 0, 0);
		this.headPart.setLayout(layout);

		let layoutData = new GridData(true, ProjectComposer.TOOLKIT_HEIGHT);
		layoutData.horizontalSpan = 2;
		this.headPart.setLayoutData(layoutData);

		this.createToolboxPartViewer(this.headPart);
		this.createToolsetPartViewer(this.headPart);
	}

	private createToolboxPartViewer(parent: Composite): void {

		this.toolboxPartViewer.createControl(parent);
		let control = this.toolboxPartViewer.getControl();

		let layoutData = new GridData(ProjectComposer.TOOLBOX_WIDTH, true);
		control.setLayoutData(layoutData);
	}

	private createToolsetPartViewer(parent: Composite): void {

		this.toolsetPartViewer.createControl(parent);
		let control = this.toolsetPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	private createBodyPart(parent: Composite): void {

		this.bodyPart = new Composite(parent);

		let element = this.bodyPart.getElement();
		element.addClass("padang-project-composer-body-part");
		element.css("background-color", "#FFFFFF");
		element.css("border-bottom", "1px solid #D8D8D8");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.bodyPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.bodyPart.setLayoutData(layoutData);

		this.createOutlinePartViewer(this.bodyPart);
		this.createPresentPartViewer(this.bodyPart);
	}

	private createOutlinePartViewer(parent: Composite): void {

		this.outlinePartViewer.createControl(parent);
		let control = this.outlinePartViewer.getControl();

		let layoutData = new GridData(ProjectComposer.OUTLINE_WIDTH, true);
		control.setLayoutData(layoutData);
	}

	private createPresentPartViewer(parent: Composite): void {

		this.presentPartViewer.createControl(parent);
		let control = this.presentPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.toolboxPartViewer.setControllerFactory(new ToolboxControllerFactory());
		this.toolsetPartViewer.setControllerFactory(new ToolsetControllerFactory());
		this.presentPartViewer.setControllerFactory(new PresentControllerFactory());
		this.outlinePartViewer.setControllerFactory(new OutlineControllerFactory());
	}

	public setModel(model: XProject, callback: () => void): void {
		this.prepareSynchronizer(model);
		this.registerSynchronizationDirector();
		this.prepareEditDomain();
		this.composeModel(model, callback);
	}

	private registerSynchronizationDirector(): void {
		let key = wef.SYNCHRONIZATION_DIRECTOR;
		this.registerDirector(key, new BaseSynchronizationDirector(this.synchronizer));
	}

	public composeModel(model: XProject, callback: () => void): void {

		// Wire part viewer
		this.wireOutlineToolsetPresentContent();
		this.wirePresentToolsetContent();

		// Toolset outline contents
		this.toolboxPartViewer.setContents(model);
		this.outlinePartViewer.setContents(model);

		// Reconcile Appliers
		this.registerIndicationReconcileApplier();
		this.registerRectificationReconcileApplier();

		this.applyProperties();
		callback();

	}

	private applyProperties(): void {
		let properties = this.getProperties();
		let width = properties.getProperty([padang.OUTLINE, padang.WIDTH]);
		if (width !== undefined) {
			let control = this.outlinePartViewer.getControl();
			let layoutData = <FillData>control.getLayoutData();
			layoutData.pixels = width;
			this.bodyPart.relayout();
		}
	}

	private getProperties(): ControllerProperties {
		let rootController = this.outlinePartViewer.getRootController();
		let contents = rootController.getContents();
		return new ControllerProperties(contents, XProject.FEATURE_PROPERTIES);
	}

	private wireOutlineToolsetPresentContent(): void {
		let director = wef.getSelectionDirector(this.outlinePartViewer);
		let listener = new OutlineSelectionChangedListener(
			this.toolsetPartViewer,
			this.presentPartViewer
		);
		director.addSelectionChangedListener(listener);
	}

	private wirePresentToolsetContent(): void {
		let director = wef.getSelectionDirector(this.presentPartViewer);
		let listener = new PresentSelectionChangedListener(
			this.toolsetPartViewer
		);
		director.addSelectionChangedListener(listener);
	}

	private registerApplier(leanName: string, applier: FileReconcileApplier): void {
		let director = bekasi.getReconcileDirector(this);
		let fileId = this.getFileId();
		director.registerFileApplier(leanName, fileId, applier);
	}

	private registerRectificationReconcileApplier(): void {
		let applier = new RectificationReconcileApplier(this);
		this.registerApplier(RectificationReconcile.LEAN_NAME, applier);
	}

	private registerIndicationReconcileApplier(): void {
		let applier = new IndicationReconcileApplier(this);
		this.registerApplier(IndicationReconcile.LEAN_NAME, applier);
	}

	public getPresentPartViewer(): PresentPartViewer {
		return this.presentPartViewer;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class OutlineSelectionChangedListener implements SelectionChangedListener {

	private toolsetPartViewer: ToolsetPartViewer = null;
	private presentPartViewer: PresentPartViewer = null;

	constructor(
		toolsetPartViewer: ToolsetPartViewer,
		presentPartViewer: PresentPartViewer,
	) {
		this.toolsetPartViewer = toolsetPartViewer;
		this.presentPartViewer = presentPartViewer;
	}

	public selectionChanged(event: SelectionChangedEvent): void {
		let selection = event.getSelection();
		if (!selection.isEmpty()) {
			let controller = <Controller>selection.getFirstElement();
			let sheet = <XSheet>controller.getModel();
			this.toolsetPartViewer.setContents(sheet);
			this.presentPartViewer.setContents(sheet);
		} else {
			this.toolsetPartViewer.resetContents();
			this.presentPartViewer.resetContents();
		}
	}

}

class PresentSelectionChangedListener implements SelectionChangedListener {

	private toolsetPartViewer: ToolsetPartViewer = null;

	constructor(toolsetPartViewer: ToolsetPartViewer) {
		this.toolsetPartViewer = toolsetPartViewer;
	}

	public selectionChanged(event: SelectionChangedEvent): void {
		this.setToolsetContent(event);
	}

	private setToolsetContent(event: SelectionChangedEvent): void {
		let selection = event.getSelection();
		if (!selection.isEmpty()) {
			let controller = <Controller>selection.getFirstElement();
			let model = controller.getModel();
			if (model instanceof XCell) {
				this.toolsetPartViewer.setContents(model);
			}
		}
	}

}
