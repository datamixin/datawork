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
import Request from "webface/wef/Request";
import Conductor from "webface/wef/Conductor";
import Controller from "webface/wef/Controller";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import WizardContainer from "webface/dialogs/WizardContainer";

import BaseWizardDialogPage from "webface/wef/base/BaseWizardDialogPage";

import * as padang from "padang/padang";

import * as widgets from "padang/widgets/widgets";

import GraphicPremise from "padang/ui/GraphicPremise";

import XRoutine from "rinjani/model/XRoutine";
import RinjaniCreator from "rinjani/model/RinjaniCreator";

import * as directors from "rinjani/directors";

import PlotListRequest from "rinjani/requests/PlotListRequest";
import PlotDetailRequest from "rinjani/requests/PlotDetailRequest";

import PlotListHandler from "rinjani/handlers/PlotListHandler";
import PlotDetailHandler from "rinjani/handlers/PlotDetailHandler";

import RoutineReference from "rinjani/dialogs/RoutineReference";

import PlotSelectionPanel from "rinjani/panels/PlotSelectionPanel";

import ModelConverter from "rinjani/directors/converters/ModelConverter";

import BasePlotPlanDirector from "rinjani/directors/BasePlotPlanDirector";

export default class PlotDialogPage extends BaseWizardDialogPage implements RoutineReference {

	private premise: GraphicPremise = null;
	private routine: XRoutine = null;
	private composite: Composite = null;
	private partViewer: PlotDialogPartViewer = null;

	constructor(container: WizardContainer, conductor: Conductor, premise: GraphicPremise) {
		super(container, conductor, "Plot Selection");
		this.premise = premise;
		this.prepareRoutine();
	}

	private prepareRoutine(): void {
		let creator = RinjaniCreator.eINSTANCE;
		this.routine = creator.createRoutine();
		let converter = new ModelConverter();
		let value = converter.convertModelToValue(this.routine);
		let mapping = this.premise.getMapping();
		mapping.setValue(padang.FORMATION, value);
	}

	public getModel(): XRoutine {
		return this.routine;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1, 10, 10);
		this.createSelectionPanel(this.composite);
	}

	private createSelectionPanel(parent: Composite): void {
		this.partViewer = new PlotDialogPartViewer(this.conductor, this.premise);
		this.partViewer.createControl(parent);
		this.partViewer.setOnComplete(() => {

			let selection = this.partViewer.getSelection();
			this.routine.setName(selection);

			let creator = RinjaniCreator.eINSTANCE;
			let list = this.routine.getInputs();
			let inputs = creator.createInputList(this.partViewer, selection);
			list.repopulate(inputs);

			this.updatePageComplete();
		});
		widgets.setGridData(this.partViewer, true, true);
	}

	public getControl(): Control {
		return this.composite;
	}

}

class PlotDialogPartViewer extends BasePartViewer implements Conductor {

	private conductor: Conductor = null;
	private premise: GraphicPremise = null;
	private selectionPanel: PlotSelectionPanel = null;

	constructor(conductor: Conductor, premise: GraphicPremise) {
		super();
		this.conductor = conductor;
		this.premise = premise;
		this.registerPlotPlanDirector();
	}

	public submit(request: Request, callback?: (data: any) => void): void {
		let requestName = request.getName();
		if (requestName === PlotListRequest.REQUEST_NAME) {
			let handler = new PlotListHandler(<Controller><any>this);
			handler.handle(request, callback);
		} else if (requestName === PlotDetailRequest.REQUEST_NAME) {
			let handler = new PlotDetailHandler(<Controller><any>this);
			handler.handle(request, callback);
		} else {
			this.conductor.submit(request, callback);
		}
	}

	private registerPlotPlanDirector(): void {
		let director = new BasePlotPlanDirector(this.premise);
		this.registerDirector(directors.PLOT_PLAN_DIRECTOR, director);
	}

	public createControl(parent: Composite) {
		this.selectionPanel = new PlotSelectionPanel(this);
		this.selectionPanel.createControl(parent);
	}

	public setOnComplete(callback: () => void): void {
		this.selectionPanel.setOnComplete(callback);
	}

	public getSelection(): string {
		return this.selectionPanel.getSelection();
	}

	public getControl(): Control {
		return this.selectionPanel.getControl();
	}

}