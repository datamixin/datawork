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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import DualButtonPanel from "bekasi/panels/DualButtonPanel";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";

export default class WorkspaceFullDeck {

	private static BUTTON_WIDTH = 100;
	private static HEADER_HEIGHT = 52;

	private composite: Composite = null;
	private headerPart: Composite = null;
	private titleLabel: Label = null;
	private cancelOKPanel: DualButtonPanel = null;
	private contentPart: Composite = null;
	private panel: FullDeckPanel = null;
	private callback = (_result: string) => { };

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-workspace-fulldeck");
		element.css("background-color", "#FFF");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createHeaderPart(this.composite);
		this.createContentPart(this.composite);
	}

	private createHeaderPart(parent: Composite): void {

		this.headerPart = new Composite(parent);

		let element = this.headerPart.getElement();
		element.addClass("bekasi-workspace-fulldeck-header-part");
		element.css("border-bottom", "1px solid #D8D8D8");
		element.css("background-color", "1#F8F8F8");

		let layout = new GridLayout(2, 10, 10);
		this.headerPart.setLayout(layout);

		let layoutData = new GridData(true, WorkspaceFullDeck.HEADER_HEIGHT);
		this.headerPart.setLayoutData(layoutData);

		this.createTitleLabel(this.headerPart);
		this.createCancelOKPanel(this.headerPart);
	}

	private createTitleLabel(parent: Composite): void {

		this.titleLabel = new Label(parent);

		let element = this.titleLabel.getElement();
		element.css("color", "#444");
		element.css("font-weight", "500");
		element.css("font-size", "larger");

		let layoutData = new GridData(true, true);
		this.titleLabel.setLayoutData(layoutData);
	}

	private createCancelOKPanel(parent: Composite): void {

		this.cancelOKPanel = new DualButtonPanel(
			"Cancel", null, "btn-default", "OK", "check-bold", "btn-success");
		this.cancelOKPanel.createControl(parent)

		let layout = <GridLayout>this.headerPart.getLayout();

		let control = this.cancelOKPanel.getControl();
		let layoutData = new GridData(WorkspaceFullDeck.BUTTON_WIDTH * 2 + layout.horizontalSpacing, true);
		control.setLayoutData(layoutData);

		this.cancelOKPanel.onLeftSelection(() => {
			let result = FullDeckPanel.CANCEL;
			this.panel.postClose(result, () => {
				this.panel.preClose();
				this.callback(result);
			});
		});

		this.cancelOKPanel.onRightSelection(() => {
			let result = FullDeckPanel.OK;
			this.panel.postClose(result, () => {
				this.panel.preClose();
				this.callback(result);
			});
		});

	}

	private createContentPart(parent: Composite): void {

		this.contentPart = new Composite(parent);

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.contentPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.contentPart.setLayoutData(layoutData);
	}

	public open(panel: FullDeckPanel, callback: (result: string) => void): void {

		panel.createControl(this.contentPart);

		let title = panel.getTitle();
		this.titleLabel.setText(title);

		let control = panel.getControl();
		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

		this.contentPart.relayout();

		this.callback = callback;
		this.panel = panel;

		this.panel.postOpen();
	}

	public getControl(): Control {
		return this.composite;
	}

}