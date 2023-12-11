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
import Panel from "webface/wef/Panel";

import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import SlemanCreator from "sleman/model/SlemanCreator";

import FormulaParser from "bekasi/FormulaParser";

import VisageList from "bekasi/visage/VisageList";
import VisageBrief from "bekasi/visage/VisageBrief";
import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import * as widgets from "padang/widgets/widgets";

import BuilderPremise from "padang/ui/BuilderPremise";

import Learning from "padang/functions/model/Learning";

import ScrollablePanel from "padang/panels/ScrollablePanel";

import XModeler from "malang/model/XModeler";

import FeatureField from "malang/panels/fields/FeatureField";
import FeatureFieldFactory from "malang/panels/fields/FeatureFieldFactory";

import InputFeatureReader from "malang/directors/InputFeatureReader";
import BuilderPremiseEvaluator from "malang/directors/BuilderPremiseEvaluator";
import PredictionResultPremise from "malang/directors/PredictionResultPremise";

export default class PredictionTryoutPanel implements Panel {

	public static ITEM_HEIGHT = 24;
	public static ACTION_HEIGHT = 30;
	public static BOTTON_WIDTH = 160;

	private premise: BuilderPremise = null;
	private model: XModeler = null;
	private features: Map<string, any> = null;
	private targets: Map<string, any> = null;
	private composite: Composite = null;
	private featuresPanel: ScrollablePanel = null;
	private featurePanels: FeaturePanel[] = [];
	private predictButton: Button = null;
	private messageLabel: Label = null;
	private targetsPart: Composite = null;
	private targetPanels: FeaturePanel[] = [];

	constructor(premise: BuilderPremise, model: XModeler) {
		this.premise = premise;
		this.model = model;
		this.prepareFeatures();
		this.prepareTargets();
	}

	private prepareFeatures(): void {
		let reader = new InputFeatureReader(this.model);
		let features = reader.buildInputFeatureNameFormulas(Learning.FEATURES);
		this.features = features;
	}

	private prepareTargets(): void {
		let reader = new InputFeatureReader(this.model);
		let targets = reader.buildInputFeatureNameFormulas(Learning.TARGET);
		this.targets = targets;
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		widgets.addClass(this.composite, "malang-prediction-tryout-pane");
		widgets.setGridLayout(this.composite, 1, 5, 5, 0, 10);
		this.createHeaderPart(this.composite);
		this.createFeaturesPart(this.composite);
		this.createActionPart(this.composite);
		this.createMessageLabel(this.composite);
		this.createTargetsPart(this.composite);
	}

	private createHeaderPart(parent: Composite): void {
		let label = new Label(parent);
		label.setText("Features (" + this.features.size + "):");
		widgets.css(label, "line-height", PredictionTryoutPanel.ITEM_HEIGHT + "px");
		widgets.setGridData(label, true, PredictionTryoutPanel.ITEM_HEIGHT);
	}

	private createFeaturesPart(parent: Composite): void {

		this.featuresPanel = new ScrollablePanel(0, 0, 5);
		this.featuresPanel.createControl(parent);
		widgets.addClass(this.featuresPanel, "malang-prediction-tryout-panel-features-part");

		for (let key of this.features.keys()) {
			let formula = this.features.get(key);
			let featurePanel = new FeaturePanel(this.premise, key, formula, false);
			this.featuresPanel.addPanel(featurePanel);
			this.featurePanels.push(featurePanel);
		}

	}

	private createActionPart(parent: Composite): void {
		let actionPart = new Composite(parent);
		widgets.setGridLayout(actionPart, 1, 0, 0, 0, 0);
		widgets.setGridData(actionPart, true, PredictionTryoutPanel.ACTION_HEIGHT);
		this.createPredictButton(actionPart);
	}

	private createPredictButton(parent: Composite): void {
		this.predictButton = new Button(parent);
		this.predictButton.setText("Predict");
		widgets.setGridData(this.predictButton, PredictionTryoutPanel.BOTTON_WIDTH, true);
		this.predictButton.onSelection(() => {

			// Features
			let creator = SlemanCreator.eINSTANCE;
			let parser = new FormulaParser();
			let features = creator.createList();
			for (let panel of this.featurePanels) {
				let value = panel.getValue();
				let expression = parser.parse(value);
				let series = creator.createList();
				creator.addElement(series, expression);
				creator.addElement(features, series);
			}

			// Predict
			let premise = new PredictionResultPremise(this.premise, this.model);
			premise.evaluate(features, (result: VisageValue) => {
				if (result instanceof VisageError) {
					let message = result.getMessage();
					this.setErrorMessage(message);
				} else if (result instanceof VisageList) {
					let values = result.getValues();
					for (let i = 0; i < values.length; i++) {
						let value = values[i];
						let targetPanel = this.targetPanels[i];
						targetPanel.setValue(value);
					}
					this.setShowMessage(false);
				} else {
					let leanName = result.xLeanName();
					this.setErrorMessage("Unexpected result type " + leanName);
				}
			});
		});
	}

	private createMessageLabel(parent: Composite): void {
		this.messageLabel = new Label(parent);
		widgets.css(this.messageLabel, "line-height", PredictionTryoutPanel.ITEM_HEIGHT + "px");
		widgets.css(this.messageLabel, "color", "#F44");
		widgets.setGridData(this.messageLabel, true, 0);
	}

	private createTargetsPart(parent: Composite): void {

		this.targetsPart = new Composite(parent);
		let layout = widgets.setGridLayout(this.targetsPart, 1, 0, 0);

		for (let key of this.targets.keys()) {
			let formula = this.targets.get(key);
			let targetPanel = new FeaturePanel(this.premise, key, formula, true);
			targetPanel.createControl(this.targetsPart);
			widgets.setGridData(targetPanel, true, PredictionTryoutPanel.ITEM_HEIGHT);
			this.targetPanels.push(targetPanel);
		}

		let height = layout.marginHeight * 2;
		height = + this.targets.size * (PredictionTryoutPanel.ITEM_HEIGHT + layout.verticalSpacing);
		widgets.setGridData(this.targetsPart, true, height);
	}

	private setShowMessage(state: boolean): void {
		widgets.setGridData(this.messageLabel, true, state === true ? PredictionTryoutPanel.ITEM_HEIGHT : 0);
		this.composite.relayout();
	}

	private setErrorMessage(message: string): void {
		this.setShowMessage(true);
		this.messageLabel.setText(message);
	}

	public relayout(): void {

		let headerHeight = PredictionTryoutPanel.ITEM_HEIGHT;
		let featureHeight = this.featuresPanel.adjustHeight();
		let targetsData = <GridData>this.targetsPart.getLayoutData();
		let targetsHeight = targetsData.heightHint;
		let messageData = <GridData>this.messageLabel.getLayoutData();
		let messageHeight = messageData.heightHint;
		let actionHeight = PredictionTryoutPanel.ACTION_HEIGHT;

		let size = this.composite.computeSize();
		let layout = <GridLayout>this.composite.getLayout();
		let spacing = layout.verticalSpacing * 4 + layout.marginHeight * 2;
		let available = size.y - (headerHeight + targetsHeight + messageHeight + actionHeight + spacing);
		if (featureHeight < available) {
			widgets.setGridData(this.featuresPanel, true, featureHeight);
		} else {
			widgets.setGridData(this.featuresPanel, true, true);
		}
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class FeaturePanel implements Panel {

	public static HEIGHT = 24;
	public static INDEX_WIDTH = 30;
	public static NAME_WIDTH = 160;

	private name: string = null;
	private formula: string = null;
	private target: boolean = true;
	private premise: BuilderPremiseEvaluator = null;
	private field: FeatureField = null;

	private composite: Composite = null;
	private exampleLabel: Label = null;

	constructor(premise: BuilderPremise, name: string, formula: string, target: boolean) {
		this.name = name;
		this.formula = formula;
		this.target = target;
		this.premise = new BuilderPremiseEvaluator(premise);
	}

	public getName(): string {
		return this.name;
	}

	public createControl(parent: Composite, index?: number): void {
		this.composite = new Composite(parent, index);
		widgets.setGridLayout(this.composite, 4, 0, 0, 5, 0);
		widgets.css(this.composite, "line-height", PredictionTryoutPanel.ITEM_HEIGHT + "px");
		this.createIndexLabel(this.composite);
		this.createNameLabel(this.composite);
		this.createFeaturePart(this.composite);
		this.createExampleLabel(this.composite);
	}

	private createIndexLabel(parent: Composite): void {
		let label = new Label(parent);
		widgets.setGridData(label, FeaturePanel.INDEX_WIDTH, true);
		let composite = parent.getParent();
		let children = composite.getChildren();
		label.setText(<any>children.length);
		this.infoStyle(label);
	}

	private createNameLabel(parent: Composite): void {
		let label = new Label(parent);
		label.setText(this.name);
		widgets.setGridData(label, FeaturePanel.NAME_WIDTH, true);
	}

	protected createFeaturePart(parent: Composite): void {
		let container = new Composite(parent);
		widgets.setGridData(container, true, true);
		widgets.setGridLayout(container, 1, 0, 0, 0, 0);
		this.createFeatureControl(container);
	}

	private createFeatureControl(parent: Composite): void {

		this.premise.getResultBrief(this.formula, (brief: VisageBrief) => {

			let type = brief.getType();
			let factory = FeatureFieldFactory.getInstance();
			let premise = this.premise.getPremise();
			let field = factory.create(type, premise, this.target);
			field.createControl(parent);
			field.populate(this.formula);

			widgets.setGridData(field, true, true);
			parent.relayout();

			this.field = field;

			this.premise.getResultExample(this.formula, 1, (list: VisageList) => {
				let value = list.get(0);
				let text = field.getExampleText(value);
				this.exampleLabel.setText("Eg.: " + text);
			});
		});

	}

	private createExampleLabel(parent: Composite): void {
		this.exampleLabel = new Label(parent);
		widgets.setGridData(this.exampleLabel, true, true);
		this.infoStyle(this.exampleLabel);
	}

	private infoStyle(control: Control): void {
		widgets.css(control, "color", "#CCC");
		widgets.css(control, "font-style", "italic");
	}

	public setValue(value: VisageValue): void {
		this.field.setValue(value);
	}

	public getValue(): string {
		return this.field.getValue();
	}

	public adjustHeight(): number {
		return FeaturePanel.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
