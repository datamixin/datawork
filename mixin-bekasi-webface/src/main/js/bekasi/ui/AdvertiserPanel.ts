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
import WebFontIcon from "webface/widgets/WebFontIcon";

import Caution from "webface/core/Caution";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import CautionPanel from "webface/ui/CautionPanel";

import AdvertiserPart from "bekasi/ui/AdvertiserPart";
import AdvertiserAgent from "bekasi/ui/AdvertiserAgent";

export default class AdvertiserPanel implements AdvertiserAgent {

	private static PART_MIN_HEIGHT = 40;

	private composite: Composite = null;
	private parts: SimpleAdvertiserPart[] = [];
	private callback = (_panel: AdvertiserPanel) => { };

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-advertiser-panel");

		let layout = new GridLayout(1, 0, 0, 0, 10);
		this.composite.setLayout(layout);

	}

	public createAdvertiserPart(title: string): AdvertiserPart {

		let part = new SimpleAdvertiserPart(title);
		part.createControl(this.composite);

		let control = part.getControl();
		let layoutData = new GridData(true, AdvertiserPanel.PART_MIN_HEIGHT);
		control.setLayoutData(layoutData);

		this.parts.push(part);

		part.setAddCallback((_part: SimpleAdvertiserPart) => {
			this.callback(this);
		});

		part.setCloseCallback((part: SimpleAdvertiserPart) => {
			let index = this.parts.indexOf(part);
			this.parts.splice(index, 1);
			this.callback(this);
		});

		return part;
	}

	public setCallback(callback: (panel: AdvertiserPanel) => void): void {
		this.callback = callback;
	}

	public adjustHeight(): number {

		let height = 0;
		let layout = <GridLayout>this.composite.getLayout();
		height += 2 * layout.marginHeight;

		let length = Math.min(this.parts.length, 1);
		for (let i = 0; i < length; i++) {
			let part = this.parts[i];
			let partHeight = part.adjustHeight();
			let control = part.getControl();
			let layoutData = <GridData>control.getLayoutData();
			layoutData.heightHint = partHeight;
			height += partHeight;

			if (i > 0) {
				height += layout.verticalSpacing;
			}
		}

		return height;
	}

	public getControl(): Control {
		return this.composite;
	}
}

class SimpleAdvertiserPart implements AdvertiserPart {

	private static CLOSE_DELAY = 1000;
	private static HEADER_HEIGHT = 24;
	private static MESSAGE_HEIGHT = 20;
	private static CAUTION_HEIGHT = 320;
	private static ICON_WIDTH = 24;

	private title: string = null
	private addCallback = (_part: AdvertiserPart) => { };
	private closeCallback = (_part: AdvertiserPart) => { };
	private composite: Composite = null;
	private headerPart: Composite = null;
	private titleLabel: Label = null;
	private closeIcon: WebFontIcon = null;
	private detailPart: Composite = null;

	constructor(title: string) {
		this.title = title;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-simple-advertiser-part");
		element.hide();

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createHeaderPart(this.composite);
		this.createDetailPart(this.composite);
	}

	private createHeaderPart(parent: Composite): void {

		this.headerPart = new Composite(parent);

		let element = this.headerPart.getElement();
		element.addClass("bekasi-simple-advertiser-header-part");
		element.css("line-height", SimpleAdvertiserPart.HEADER_HEIGHT + "px");
		element.css("font-weight", "500");

		let layout = new GridLayout(2, 0, 0);
		this.headerPart.setLayout(layout);

		let layoutData = new GridData(true, SimpleAdvertiserPart.HEADER_HEIGHT);
		this.headerPart.setLayoutData(layoutData);

		this.createTitleLabel(this.headerPart);
		this.createCloseIcon(this.headerPart);

	}

	private createTitleLabel(parent: Composite): void {

		this.titleLabel = new Label(parent);
		this.titleLabel.setText(this.title);

		let element = this.titleLabel.getElement();
		element.css("text-indent", "10px");

		let layoutData = new GridData(true, true);
		this.titleLabel.setLayoutData(layoutData);
	}

	private createCloseIcon(parent: Composite): void {

		this.closeIcon = new WebFontIcon(parent);
		this.closeIcon.addClasses("mdi", "mdi-close");

		let element = this.closeIcon.getElement();
		element.css("line-height", SimpleAdvertiserPart.HEADER_HEIGHT + "px");
		element.css("font-size", "18px");

		let layoutData = new GridData(SimpleAdvertiserPart.ICON_WIDTH, true);
		this.closeIcon.setLayoutData(layoutData);

		this.closeIcon.onSelection(() => {
			this.close(0);
		});
	}

	private createDetailPart(parent: Composite): void {

		this.detailPart = new Composite(parent);

		let element = this.detailPart.getElement();
		element.addClass("bekasi-simple-advertiser-detail-part");

		let layout = new GridLayout(1, 10, 10, 5, 5);
		this.detailPart.setLayout(layout);

		let layoutData = new GridData(true, true);
		this.detailPart.setLayoutData(layoutData);

	}

	private createMessageLabel(parent: Composite, text: string): void {

		let label = new Label(parent);
		label.setText(text);

		let element = label.getElement();
		element.css("text-indent", "10px");

		let layoutData = new GridData(true, SimpleAdvertiserPart.MESSAGE_HEIGHT);
		label.setLayoutData(layoutData);

	}

	private createCautionPanel(parent: Composite, caution: Caution): void {

		let panel = new CautionPanel();
		panel.createControl(parent, -1);
		let control = panel.getControl();

		let layoutData = new GridData(true, SimpleAdvertiserPart.CAUTION_HEIGHT);
		control.setLayoutData(layoutData);

		panel.setCaution(caution);
		panel.toggleExpanded();
	}

	public message(text: string): void {
		this.createMessageLabel(this.detailPart, text);
		this.addCallback(this);
	}

	public exhibit(): void {
		let element = this.composite.getElement();
		element.show();
	}

	public error(caution: any): void {
		if (caution instanceof Caution) {
			this.createCautionPanel(this.detailPart, caution)
		} else {
			this.createMessageLabel(this.detailPart, caution);
		}
		this.addCallback(this);
	}

	public close(delay?: number): void {
		if (delay === undefined) {
			delay = SimpleAdvertiserPart.CLOSE_DELAY;
		}
		setTimeout(() => {
			this.composite.dispose();
			this.closeCallback(this);
		}, delay);
	}

	public adjustHeight(): number {

		let height = 0;
		let compositeLayout = <GridLayout>this.composite.getLayout();
		height += 2 * compositeLayout.marginHeight;

		// Header title
		height += SimpleAdvertiserPart.HEADER_HEIGHT;
		height += compositeLayout.verticalSpacing;

		// Detail part
		let detailLayout = <GridLayout>this.detailPart.getLayout();
		height += 2 * detailLayout.marginHeight;

		// Detail children
		let children = this.detailPart.getChildren();
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			let layoutData = <GridData>child.getLayoutData();
			height += layoutData.heightHint;
			if (i > 0) {
				height += detailLayout.verticalSpacing;
			}
		}

		return height + 4;
	}

	public setAddCallback(callback: (part: AdvertiserPart) => void): void {
		this.addCallback = callback;
	}

	public setCloseCallback(callback: (part: AdvertiserPart) => void): void {
		this.closeCallback = callback;
	}

	public getControl(): Control {
		return this.composite;
	}

}