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
import * as webface from "webface/webface";

import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";
import WizardContainer from "webface/dialogs/WizardContainer";
import WizardDialogPage from "webface/dialogs/WizardDialogPage";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import FillLayout from "webface/layout/FillLayout";

export abstract class WizardDialog extends Dialog implements WizardContainer {

	public static COMPLETED = "completed";
	public static SELECTED = "selected";
	public static PLANNED = "planned";

	public static TITLE_AREA_HEIGHT = 54;
	public static SERIES_WIDTH = 200;
	public static STEP_HEIGHT = 44;
	public static STEP_TITLE_HEIGHT = 24;
	public static STEP_ICON_SIZE = 24;

	private titleArea: Composite;
	private titleLabel: Label;
	private messageLabel: Label;
	private body: Composite = null;
	private seriesPart: Composite = null;
	private inputsPart: Composite = null;
	private selectedPage: WizardDialogPage = null;

	protected backButton: Button;
	protected nextButton: Button;
	protected finishButton: Button;

	private title = "Wizard Dialog";
	private message = "Please specify page content";

	constructor() {
		super();
		this.setDialogSize(420, 360);
	}

	public createContents(parent: Composite): void {

		let composite = new Composite(parent);

		let element = composite.getElement();
		element.addClass("wizard-dialog-contents");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		composite.setLayout(layout);

		this.createTitleArea(composite);
		this.createBody(composite);
	}

	private createTitleArea(parent: Composite): void {

		this.titleArea = new Composite(parent);

		let element = this.titleArea.getElement();
		element.addClass("wizard-dialog-title-area");

		let layout = new GridLayout(1, 10);
		this.titleArea.setLayout(layout);

		let layoutData = new GridData(true, WizardDialog.TITLE_AREA_HEIGHT);
		layoutData.grabExcessHorizontalSpace = true;
		this.titleArea.setLayoutData(layoutData);

		this.createTitleLabel(this.titleArea);
		this.createMessageLabel(this.titleArea);

	}

	private createTitleLabel(parent: Composite): void {

		this.titleLabel = new Label(parent);
		this.titleLabel.setText(this.title);

		// Element
		let element = this.titleLabel.getElement();
		element.addClass("wizard-dialog-title-label");
		element.css("font-weight", "bold");
	}

	private createMessageLabel(parent: Composite): void {

		this.messageLabel = new Label(parent);
		this.messageLabel.setText(this.message);

		let element = this.messageLabel.getElement();
		element.addClass("wizard-dialog-message-label");

		let layoutData = new GridData(true, true);
		layoutData.horizontalIndent = 10;
		this.messageLabel.setLayoutData(layoutData);
	}

	private createBody(parent: Composite): void {

		this.body = new Composite(parent);

		// Element
		let element = this.body.getElement();
		element.css("border-top", "1px solid #F0F0F0");
		element.css("border-bottom", "1px solid #F0F0F0");

		element.addClass("wizard-dialog-body");

		let layout = new FillLayout(webface.HORIZONTAL, 0, 0);
		this.body.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.body.setLayoutData(layoutData);

		this.createControl(this.body);

	}

	protected createControl(parent: Composite): void {

		let composite = new Composite(parent);

		let element = composite.getElement();
		element.addClass("wizard-dialog-control");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		composite.setLayout(layout);

		// Create parts
		this.createSeriesPart(composite);
		this.createInputsPart(composite);

		this.addPages(this.seriesPart);

		// Init selection
		let children = this.seriesPart.getChildren();
		let panel = <StepPanel>children[0].getData();
		let firstPage = panel.getPage();
		this.setSelectedPage(firstPage);

		// Prevent close saat enter
		this.setDefaultButton(null);

	}

	private createSeriesPart(parent: Composite): void {

		this.seriesPart = new Composite(parent);

		let element = this.seriesPart.getElement();
		element.addClass("wizard-dialog-series-part");
		element.css("border-right", "1px solid #E8E8E8");
		element.css("background-color", "#F8F8F8");

		let layout = new GridLayout(1, 10, 10);
		this.seriesPart.setLayout(layout);

		let layoutData = new GridData(WizardDialog.SERIES_WIDTH, true);
		this.seriesPart.setLayoutData(layoutData);

	}

	private createInputsPart(parent: Composite): void {

		this.inputsPart = new Composite(parent);

		let element = this.inputsPart.getElement();
		element.addClass("wizard-dialog-inputs-part");

		let layout = new GridLayout(1, 10, 10, 0, 0);
		this.inputsPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.inputsPart.setLayoutData(layoutData);

	}

	/**
	* Call addPage to install page with become a wizard page
	*/
	protected abstract addPages(parent: Composite): void;

	protected addPage(parent: Composite, page: WizardDialogPage, index?: number): WizardDialogPage {

		let panel = new StepPanel(page);
		panel.createControl(parent, index);
		let control = panel.getControl();

		let layoutData = new GridData(true, WizardDialog.STEP_HEIGHT);
		control.setLayoutData(layoutData);

		return page;

	}

	private getStepPanels(): StepPanel[] {
		let panels: StepPanel[] = [];
		let children = this.seriesPart.getChildren();
		for (let child of children) {
			let panel = <StepPanel>child.getData();
			panels.push(panel);
		}
		return panels;
	}

	private getStepPages(): WizardDialogPage[] {
		let pages: WizardDialogPage[] = [];
		let panels = this.getStepPanels();
		for (let panel of panels) {
			let page = panel.getPage();
			pages.push(page);
		}
		return pages;
	}

	public setSelectedPage(page: WizardDialogPage): void {

		let panels = this.getStepPanels();
		let pages = this.getStepPages();
		let index = pages.indexOf(page);
		for (let i = 0; i < panels.length; i++) {

			// Apply completion
			let panel = panels[i];
			if (i < index) {
				panel.applyCompleted();
			}

			// Managed selected panel
			let onpage = panel.getPage();
			let state = i == index;
			panel.setSelected(state);

			// Create control
			let control = onpage.getControl();
			if (control === null) {
				onpage.createControl(this.inputsPart);
				control = onpage.getControl();
			}
			let layoutData = new GridData(true, state ? true : 0);
			control.setLayoutData(layoutData);

			// Selected page
			if (state === true) {
				this.updateButtons(page);
			}

		}

		this.inputsPart.relayout();

		// Post selection
		this.postPageSelected(page);
		this.selectedPage = page;
	}

	protected createButtons(buttons: DialogButtons): void {

		this.backButton = buttons.createActionButton("Back", "btn-default");
		this.backButton.onSelection(() => {
			let pages = this.getStepPages();
			let backIndex = pages.indexOf(this.selectedPage) - 1;
			if (backIndex >= 0) {
				let backPage = pages[backIndex];
				this.setSelectedPage(backPage);
			}
		});

		this.nextButton = buttons.createActionButton("Next", "btn-success");
		this.nextButton.onSelection(() => {
			let nextPage = this.selectedPage.getNextPage();
			if (nextPage === null) {
				let pages = this.getStepPages();
				let nextIndex = pages.indexOf(this.selectedPage) + 1;
				if (nextIndex < pages.length) {
					nextPage = pages[nextIndex];
					this.setSelectedPage(nextPage);
				}
			} else {
				this.setSelectedPage(nextPage);
			}
		});

		buttons.createCancelButton();
		this.finishButton = buttons.createOKButton();
		this.finishButton.setEnabled(false);

	}

	public updateButtons(page: WizardDialogPage): void {

		let pages = this.getStepPages();
		let index = pages.indexOf(page);

		// Back button enable
		let first = index === 0;
		this.backButton.setEnabled(!first);

		// Next button enable
		let next = page.canFlipToNextPage();
		this.nextButton.setEnabled(index < pages.length - 1 ? next : false);

		// Finish button enable
		let finish = index === pages.length - 1;
		this.finishButton.setEnabled(finish);

	}

	public setTitle(text: string): void {
		this.title = text;
		if (this.titleLabel) {
			this.titleLabel.setText(text)
		}
	}

	protected getBaseHeight(): number {
		let height = super.getBaseHeight();
		height += WizardDialog.TITLE_AREA_HEIGHT + 1;
		return height;
	}

	/**
	  * Support sebelum dan sesudah create title area
	  */
	public setMessage(text: string): void {
		this.message = text;
		if (this.messageLabel) { // Support sesudah create title area
			if (text === null || text === undefined) {
				this.messageLabel.setText("");
			} else {
				this.messageLabel.setText(text);
			}
			let element = this.messageLabel.getElement();
			element.css("color", "inherit");
		}
	}

	public setErrorMessage(text: string): void {
		this.message = text;
		if (this.messageLabel) { // Support sesudah create title area 
			if (text) {
				this.messageLabel.setText(text);
				let element = this.messageLabel.getElement();
				element.css("color", "#AE3341");
			} else {
				this.messageLabel.setText("");
				let element = this.messageLabel.getElement();
				element.css("color", "inherit");
			}
		}
	}

	protected postPageSelected(_page: WizardDialogPage): void {

	}

	public canFinish(): boolean {
		return true;
	}

}

export default WizardDialog;

class StepPanel {

	private page: WizardDialogPage = null;
	private composite: Composite = null;
	private icon: WebFontIcon = null;
	private completed: boolean = false;

	constructor(page: WizardDialogPage) {
		this.page = page;
	}

	public getPage(): WizardDialogPage {
		return this.page;
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("wizard-dialog-step-panel");
		element.addClass(WizardDialog.PLANNED);

		let layout = new GridLayout(2, 10, 10);
		this.composite.setLayout(layout);

		this.createPageTitle(this.composite);
		this.createPageIcon(this.composite);

	}

	private createPageTitle(parent: Composite): void {

		let title = this.page.getTitle();
		let label = new Label(parent);
		label.setText(title);
		label.setAlignment(webface.RIGHT);

		let element = label.getElement();
		element.css("line-height", WizardDialog.STEP_TITLE_HEIGHT + "px");

		let layoutData = new GridData(true, WizardDialog.STEP_TITLE_HEIGHT);
		label.setLayoutData(layoutData);
	}

	private createPageIcon(parent: Composite): void {

		this.icon = new WebFontIcon(parent);
		this.icon.addClasses("mdi", "mdi-circle-outline");

		let element = this.icon.getElement();
		element.css("font-size", WizardDialog.STEP_TITLE_HEIGHT + "px");
		element.css("line-height", WizardDialog.STEP_TITLE_HEIGHT + "px");

		let layoutData = new GridData(WizardDialog.STEP_ICON_SIZE, WizardDialog.STEP_ICON_SIZE);
		this.icon.setLayoutData(layoutData);

	}

	private resetIcon(): void {
		this.icon.removeClasses("mdi-*");
	}

	public applyCompleted(): void {
		this.completed = true;
	}

	public setSelected(selected: boolean): void {
		this.resetIcon();
		let current = this.completed ? "check-circle-outline" : "circle-outline";
		this.icon.addClasses("mdi", "mdi-" + (selected ? "circle-double" : current))
		let element = this.composite.getElement();
		if (selected === true) {
			element.removeClass(WizardDialog.COMPLETED);
			element.removeClass(WizardDialog.PLANNED);
			element.addClass(WizardDialog.SELECTED);
		} else {
			element.removeClass(WizardDialog.SELECTED);
			element.addClass(this.completed ? WizardDialog.COMPLETED : WizardDialog.PLANNED);
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}
