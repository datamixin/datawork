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
import MessageDialog from "webface/dialogs/MessageDialog";

import WaitStep from "bekasi/ui/tutorials/WaitStep";
import ClickStep from "bekasi/ui/tutorials/ClickStep";
import BaseSelector from "bekasi/ui/tutorials/BaseSelector";
import TextSelector from "bekasi/ui/tutorials/TextSelector";
import ItemSelector from "bekasi/ui/tutorials/ItemSelector";
import TutorialStep from "bekasi/ui/tutorials/TutorialStep";
import DragDropStep from "bekasi/ui/tutorials/DragDropStep";
import AttrSelector from "bekasi/ui/tutorials/AttrSelector";
import StyleSelector from "bekasi/ui/tutorials/StyleSelector";
import PointerPosition from "bekasi/ui/tutorials/PointerPosition";

export abstract class Tutorial {

	private label: string = null;
	private steps: TutorialStep[] = [];

	public setLabel(label: string): void {
		this.label = label;
	}

	public getLabel(): string {
		return this.label;
	}

	public getSteps(): TutorialStep[] {
		return this.steps;
	}

	public click(selectors: string): void {
		let selector = new BaseSelector(selectors);
		let step = new ClickStep(selector);
		this.steps.push(step);
	}

	public clickText(selectors: string, text: string): void {
		let selector = new TextSelector(selectors, text);
		let step = new ClickStep(selector);
		this.steps.push(step);
	}

	public clickItem(selectors: string, index: number): void {
		let selector = new ItemSelector(selectors, index);
		let step = new ClickStep(selector);
		this.steps.push(step);
	}

	public clickStyle(selectors: string, name: string, value: any): void {
		let selector = new StyleSelector(selectors, name, value);
		let step = new ClickStep(selector);
		this.steps.push(step);
	}

	public dragItem(source: string, index: number, target: string): void {
		let sourceSelector = new ItemSelector(source, index);
		let targetSelector = new BaseSelector(target);
		let step = new DragDropStep(sourceSelector, targetSelector);
		this.steps.push(step);
	}

	public wait(selectors: string): void {
		let selector = new BaseSelector(selectors);
		let step = new WaitStep(selector);
		this.steps.push(step);
	}

	public waitStyle(selectors: string, name: string, value: any): void {
		let selector = new StyleSelector(selectors, name, value);
		let step = new WaitStep(selector);
		this.steps.push(step);
	}

	public waitAttr(selectors: string, name: string, value: any): void {
		let selector = new AttrSelector(selectors, name, value);
		let step = new WaitStep(selector);
		this.steps.push(step);
	}

	public setup() {
		let position = PointerPosition.getInstance();
		position.show();
	}

	public cleanup() {
		let position = PointerPosition.getInstance();
		position.hide();
	}

	public execute(): void {
		this.setup();
		this.doExecute(0);
	}

	private doExecute(index: number): void {
		if (index === this.steps.length) {
			this.cleanup();
		} else {
			let step = this.steps[index];
			step.execute((message: string) => {
				if (message === null) {
					if (index < this.steps.length - 1) {
						this.doExecute(index + 1);
					} else {
						let title = "Tutorial Complete";
						let message = this.label + " tutorial is complete";
						MessageDialog.openInformation(title, message, () => { });
						this.cleanup();
					}
				} else {
					let title = "Tutorial Error";
					MessageDialog.openError(title, message, () => { });
					this.cleanup();
				}
			});
		}
	}

}

export default Tutorial;