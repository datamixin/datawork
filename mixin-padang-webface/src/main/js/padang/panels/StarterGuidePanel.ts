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
import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";
import LayoutablePart from "webface/wef/LayoutablePart";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as widgets from "padang/widgets/widgets";

import GuideItemPanel from "padang/panels/GuideItemPanel";
import ScrollablePanel from "padang/panels/ScrollablePanel";

import InteractionPlanRegistry from "padang/plan/InteractionPlanRegistry";

import SampleFileSelectionDialog from "padang/dialogs/SampleFileSelectionDialog";
import UploadFileSelectionDialog from "padang/dialogs/UploadFileSelectionDialog";

export default class StarterGuidePanel extends ConductorPanel implements LayoutablePart {

	public static SAMPLE_LABEL = "Sample CSV";
	public static SAMPLE_ICON = "mdi-file-table-box-multiple-outline";
	public static SAMPLE_DESCRIPTION = "Read data from Sample CSV";

	public static UPLOAD_LABEL = "Upload CSV";
	public static UPLOAD_ICON = "mdi-cloud-upload-outline";
	public static UPLOAD_DESCRIPTION = "Upload file from local system";

	private margin: number = 40;
	private listPanel: ScrollablePanel = null;

	constructor(conductor: Conductor, margin?: number) {
		super(conductor);
		this.margin = margin ? margin : this.margin;
	}

	public createControl(parent: Composite): void {

		this.listPanel = new ScrollablePanel(this.margin, this.margin);
		this.listPanel.createControl(parent);

		widgets.addClass(this.listPanel, "padang-starter-guide-panel");

		this.createSampleCSVPanel(this.listPanel);
		this.createUploadFilePanel(this.listPanel);
		this.populateStarter(this.listPanel);

	}

	private populateStarter(parent: ScrollablePanel): void {
		let registry = InteractionPlanRegistry.getInstance();
		let plans = registry.getStarters();
		for (let plan of plans) {

			// Create item panel
			let panel = new GuideItemPanel(this.conductor);
			parent.addPanel(panel);

			// Label
			let label = plan.getLabel();
			let image = plan.getImage();
			let description = plan.getDescription();
			panel.setLabel(label);
			panel.setIcon(image);
			panel.setDescription(description);

			// On selection
			panel.setOnSelection(() => {
				let name = plan.getName();
				this.onStarter(name);
			});
			widgets.setGridData(panel, true, GuideItemPanel.HEIGHT);
		}
	}

	private createSampleCSVPanel(parent: ScrollablePanel): void {
		let panel = new GuideItemPanel(this.conductor);
		parent.addPanel(panel);
		panel.setLabel(StarterGuidePanel.SAMPLE_LABEL);
		panel.setIcon(StarterGuidePanel.SAMPLE_ICON);
		panel.setDescription(StarterGuidePanel.SAMPLE_DESCRIPTION);
		panel.setOnSelection(() => {
			let dialog = new SampleFileSelectionDialog(this.conductor);
			dialog.open((result: string) => {
				if (result === SampleFileSelectionDialog.OK) {
					let filePath = dialog.getFilePath();
					let options = dialog.getOptions();
					this.onSample(filePath, options);
				}
			});
		});
		widgets.setGridData(panel, true, GuideItemPanel.HEIGHT);
	}

	private createUploadFilePanel(parent: ScrollablePanel): void {
		let panel = new GuideItemPanel(this.conductor);
		parent.addPanel(panel);
		panel.setLabel(StarterGuidePanel.UPLOAD_LABEL);
		panel.setIcon(StarterGuidePanel.UPLOAD_ICON);
		panel.setDescription(StarterGuidePanel.UPLOAD_DESCRIPTION);
		panel.setOnSelection(() => {
			let dialog = new UploadFileSelectionDialog(this.conductor);
			dialog.open((result: string) => {
				if (result === UploadFileSelectionDialog.OK) {
					let filePath = dialog.getFilePath();
					this.onUpload(filePath);
				}
			});
		});
		widgets.setGridData(panel, true, GuideItemPanel.HEIGHT);
	}

	public onStarter(_name: string): void {

	}

	public onSample(_filename: string, _options: string): void {

	}

	public onUpload(_filename: string): void {

	}

	public relayout(): void {
		this.listPanel.relayout();
	}

	public getControl(): Control {
		return this.listPanel.getControl();
	}

}

