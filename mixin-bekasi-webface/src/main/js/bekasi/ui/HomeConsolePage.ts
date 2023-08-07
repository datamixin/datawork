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
import Panel from "webface/wef/Panel";

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import Scrollable from "webface/widgets/Scrollable";
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import * as bekasi from "bekasi/bekasi";

import HomeMenu from "bekasi/ui/HomeMenu";
import ConsolePage from "bekasi/ui/ConsolePage";
import TutorialMenu from "bekasi/ui/TutorialMenu";
import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";
import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";

export default class HomeConsolePage extends ConsolePage {

	private composite: Composite = null;
	private selector: ConsolePageSelector = null;
	private scrollable: Scrollable = null;
	private menuPart: Composite = null;

	constructor(viewer: BasePartViewer, selector: ConsolePageSelector) {
		super(viewer, "home", "Home", "mdi-home");
		this.selector = selector;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-home-console-page");

		let layout = new GridLayout(1, 0, 0, 10, 10);
		this.composite.setLayout(layout);

		this.createScrollable(this.composite);
	}

	private createScrollable(parent: Composite): void {

		this.scrollable = new Scrollable(parent);
		this.scrollable.setExpandHorizontal(true);
		this.createMenuPart(this.scrollable);

		let layoutData = new GridData(true, true);
		this.scrollable.setLayoutData(layoutData);

	}

	private createMenuPart(parent: Scrollable): void {

		this.menuPart = new Composite(parent);
		parent.setContent(this.menuPart);

		let element = this.menuPart.getElement();
		element.addClass("bekasi-home-console-page-menu-part");

		let layout = new GridLayout(2, 50, 50, 20, 16);
		this.menuPart.setLayout(layout);

	}

	public populateMenuList(): void {

		let factory = HomeMenuFactory.getInstance();
		let index = 0;
		let heights = 0;
		let layout = <GridLayout>this.menuPart.getLayout();
		for (let category of bekasi.CATEGORY_ORDER) {

			let container = this.createCategory(this.menuPart, category);
			let menus = factory.createMenus(category, this.viewer);
			for (let menu of menus) {
				this.createMenu(container, menu);
			}

			if (category === bekasi.CATEGORY_WIZARDS) {
				let menu = new TutorialMenu();
				this.createMenu(container, menu);
			}

			let height = container.adjustHeight();
			let layoutData = new GridData(true, height);
			let control = container.getControl();
			control.setLayoutData(layoutData);
			if (index % 2 === 0) {
				heights += height;
				heights += layout.verticalSpacing;
			}
			index++;

		}
		heights += 2 * layout.marginHeight;
		this.scrollable.setMinHeight(heights);
	}

	public createCategory(parent: Composite, category: string): CategoryPanel {
		let panel = new CategoryPanel();
		panel.createControl(parent);
		panel.setCategory(category);
		return panel;
	}

	public createMenu(category: CategoryPanel, menu: HomeMenu): MenuPanel {

		let icon = menu.getIcon();
		let label = menu.getLabel();
		let description = menu.getDescription();
		let panel = new MenuPanel();
		category.addMenu(panel);

		panel.setIcon(icon);
		panel.setBrief(label);
		panel.setDescription(description);
		panel.setCallback(() => {
			menu.run(this.selector);
		});

		return panel;
	}

	public getControl(): Control {
		return this.composite;
	}

}

class CategoryPanel implements Panel {

	private static MENU_HEIGHT = 58;
	private static CAPTION_HEIGHT = 32;

	private composite: Composite = null;
	private labelPart: Label = null;
	private container: Composite = null;

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("bekasi-home-console-page-category");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createLabelPart(this.composite);
		this.createContainer(this.composite);

	}

	private createLabelPart(parent: Composite): void {

		this.labelPart = new Label(parent);

		let element = this.labelPart.getElement();
		element.css("font-style", "italic");
		element.css("font-weight", "400");
		element.css("color", "#888");
		element.css("cursor", "inherit");

		let layoutData = new GridData(true, CategoryPanel.CAPTION_HEIGHT);
		this.labelPart.setLayoutData(layoutData);

	}

	private createContainer(parent: Composite, index?: number): void {

		this.container = new Composite(parent, index);

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.container.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.container.setLayoutData(layoutData);

	}

	public setCategory(text: string): void {
		this.labelPart.setText(text);
	}

	public addMenu(panel: MenuPanel): void {
		panel.createControl(this.container);
		let control = panel.getControl();
		let layoutData = new GridData(true, CategoryPanel.MENU_HEIGHT);
		control.setLayoutData(layoutData);
	}

	public adjustHeight(): number {
		let children = this.container.getChildren();
		let layout = <GridLayout>this.container.getLayout();
		let height = CategoryPanel.CAPTION_HEIGHT;
		return height + children.length * (CategoryPanel.MENU_HEIGHT + layout.verticalSpacing);
	}

	public getControl(): Control {
		return this.composite;
	}

}

class MenuPanel implements Panel {

	public static ICON_SIZE = 48;
	public static LABEL_HEIGHT = 20;

	private composite: Composite = null;
	private menuIcon: WebFontIcon = null;
	private labelPart: Composite = null;
	private briefLabel: Label = null;
	private descriptionLabel: Label = null;
	private callback = () => { };

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("bekasi-home-console-page-menu");

		let layout = new GridLayout(2, 5, 5, 0, 0);
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

		let size = MenuPanel.ICON_SIZE;
		let element = this.menuIcon.getElement();
		element.css("font-size", size + "px");
		element.css("line-height", size + "px");

		let layoutData = new GridData(size, size);
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
		element.css("font-weight", "500");
		element.css("cursor", "inherit");

		let layoutData = new GridData(true, MenuPanel.LABEL_HEIGHT);
		this.briefLabel.setLayoutData(layoutData);

	}

	private createDescriptionLabel(parent: Composite): void {

		this.descriptionLabel = new Label(parent);

		let element = this.descriptionLabel.getElement();
		element.css("font-style", "italic");
		element.css("cursor", "inherit");

		let layoutData = new GridData(true, MenuPanel.LABEL_HEIGHT);
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