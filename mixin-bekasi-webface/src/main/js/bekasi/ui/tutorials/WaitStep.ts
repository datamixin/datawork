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
import BaseSelector from "bekasi/ui/tutorials/BaseSelector";
import TutorialStep from "bekasi/ui/tutorials/TutorialStep";
import PointerPosition from "bekasi/ui/tutorials/PointerPosition";

export default class WaitStep extends TutorialStep {

	private selector: BaseSelector = null;
	private delay: number = 1000;

	constructor(selector: BaseSelector) {
		super();
		this.selector = selector;
	}

	public execute(callback: (message: string) => void): void {
		this.selector.select((element: JQuery, message: string) => {
			if (element !== null) {
				let position = PointerPosition.getInstance();
				position.centerToCallback(element, this.delay, () => {
					callback(null);
				});
			} else {
				callback(message);
			}
		});
	}

}