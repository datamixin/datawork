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
import Check from "webface/widgets/Check";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Dialog from "webface/dialogs/Dialog";
import PartViewer from "webface/wef/PartViewer";

import DialogButtons from "webface/dialogs/DialogButtons";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import * as bekasi from "bekasi/bekasi";

import HomeMenu from "bekasi/ui/HomeMenu";
import TutorialMenu from "bekasi/ui/TutorialMenu";
import WorkspaceShell from "bekasi/ui/WorkspaceShell";
import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";
import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";

import * as directors from "bekasi/directors";

export default class WelcomeDialog extends Dialog {

	private static INSTRUCTION_HEIGHT = 40;
	private static HIDE_CHECK_HEIGHT = 24;

	private partViewer: PartViewer = null;
	private selector: ConsolePageSelector = null;

	constructor(partViewer: PartViewer, selector: ConsolePageSelector) {
		super();
		this.setDialogSize(720, 360);
		this.setWindowTitle("Welcome Dialog");
		this.partViewer = partViewer;
		this.selector = selector;
	}

	protected createContents(parent: Composite): void {

		let composite = new Composite(parent);
		let layout = new GridLayout(1, 40, 10, 10, 20);
		layout.marginTop = 20;
		layout.marginBottom = 0;
		composite.setLayout(layout);

		this.createInstructionLabel(composite);
		this.createPromptsPart(composite);
		this.createHideCheck(composite);
	}

	private createInstructionLabel(parent: Composite): void {

		let label = new Label(parent);
		label.setText("Welcome to Datamixin, please select data science task below:")

		let element = label.getElement();
		element.css("font-style", "italic");
		element.css("font-weight", "350");
		element.css("font-size", "15px");
		element.css("line-height", WelcomeDialog.INSTRUCTION_HEIGHT + "px");
		element.css("cursor", "inherit");
		element.css("color", "#888");

		let layoutData = new GridData(true, WelcomeDialog.INSTRUCTION_HEIGHT);
		label.setLayoutData(layoutData);

	}

	private createPromptsPart(parent: Composite): void {
		let composite = new Composite(parent);

		let layout = new GridLayout(3, 0, 0, 10, 10);
		composite.setLayout(layout);

		let layoutData = new GridData(true, true);
		composite.setLayoutData(layoutData);

		let factory = HomeMenuFactory.getInstance();
		let menus = factory.createMenus(bekasi.CATEGORY_WIZARDS, this.partViewer);
		for (let menu of menus) {
			this.createPrompt(composite, menu);
		}
		let menu = new TutorialMenu();
		this.createPrompt(composite, menu);
	}

	private createPrompt(parent: Composite, menu: HomeMenu): void {

		let icon = menu.getIcon();
		let label = menu.getLabel();
		let description = menu.getDescription();
		let panel = new PromptPanel();
		panel.createControl(parent);
		panel.setIcon(icon);
		panel.setBrief(label);
		panel.setDescription(description);
		panel.setCallback(() => {
			this.close();
			menu.run(this.selector);
		});

		let control = panel.getControl();
		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

	}

	private createHideCheck(parent: Composite): void {

		let check = new Check(parent);
		check.setText("Always hide this dialog");

		let element = check.getElement();
		element.css("line-height", WelcomeDialog.HIDE_CHECK_HEIGHT + "px");

		let layoutData = new GridData(true, WelcomeDialog.HIDE_CHECK_HEIGHT);
		check.setLayoutData(layoutData);

		let director = directors.getSystemWorkspaceDirector(this.partViewer);
		director.getPreference(WorkspaceShell.WELCOME_SHOW, (value: any) => {
			check.setChecked(parseInt(value) === 0);
		});

		check.onSelection(() => {
			let checked = check.isChecked();
			let director = directors.getSystemWorkspaceDirector(this.partViewer);
			director.setPreference(WorkspaceShell.WELCOME_SHOW, checked ? 0 : 1);
		});

	}

	protected createButtons(buttons: DialogButtons): void {
		let button = buttons.createActionButton("Close", "btn-primary");
		button.onSelection(() => {
			this.close();
		});
	}

}

class PromptPanel {

	private static ICON_SIZE = 48;
	private static LABEL_HEIGHT = 20;

	private composite: Composite = null;
	private menuIcon: WebFontIcon = null;
	private labelPart: Composite = null;
	private briefLabel: Label = null;
	private descriptionLabel: Label = null;
	private callback = () => { };

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("bekasi-welcome-dialog");
		element.css("text-align", "center");

		let layout = new GridLayout(1, 5, 5, 5, 5);
		this.composite.setLayout(layout);

		this.createMenuIcon(this.composite);
		this.createLabelPart(this.composite);

		this.composite.onSelection(() => {
			this.callback();
		});
	}

	private createMenuIcon(parent: Composite): void {

		this.menuIcon = new WebFontIcon(parent);
		this.menuIcon.addClass("mdi");

		let size = PromptPanel.ICON_SIZE;
		let element = this.menuIcon.getElement();
		element.css("font-size", size + "px");
		element.css("line-height", size + "px");

		let layoutData = new GridData(true, size);
		this.menuIcon.setLayoutData(layoutData);

	}

	private createLabelPart(parent: Composite): void {

		this.labelPart = new Composite(parent);

		let layout = new GridLayout(1, 5, 5, 0, 0);
		this.labelPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.labelPart.setLayoutData(layoutData);

		this.createBriefLabel(this.labelPart);
		this.createDescriptionLabel(this.labelPart);

	}

	private createBriefLabel(parent: Composite): void {

		this.briefLabel = new Label(parent);

		let element = this.briefLabel.getElement();
		element.css("font-weight", "bold");
		element.css("cursor", "inherit");

		let layoutData = new GridData(true, PromptPanel.LABEL_HEIGHT);
		this.briefLabel.setLayoutData(layoutData);

	}

	private createDescriptionLabel(parent: Composite): void {

		this.descriptionLabel = new Label(parent);

		let element = this.descriptionLabel.getElement();
		element.css("font-style", "italic");
		element.css("cursor", "inherit");
		element.css("white-space", "break-spaces");

		let layoutData = new GridData(true, true);
		this.descriptionLabel.setLayoutData(layoutData);

	}

	public setIcon(icon: string): void {
		this.menuIcon.addClass(icon);
	}

	public setBrief(text: string): void {
		this.briefLabel.setText(text);
	}

	public setDescription(text: string): void {
		this.descriptionLabel.setText(text);
	}

	public setCallback(callback: () => void): void {
		this.callback = callback;
	}

	public getControl(): Control {
		return this.composite;
	}

}