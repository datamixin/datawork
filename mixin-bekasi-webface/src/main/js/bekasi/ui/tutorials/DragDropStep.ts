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
import DragDropSimulator from "webface/util/DragDropSimulator";

import BaseSelector from "bekasi/ui/tutorials/BaseSelector";
import TutorialStep from "bekasi/ui/tutorials/TutorialStep";
import PointerPosition from "bekasi/ui/tutorials/PointerPosition";

export default class DragDropStep extends TutorialStep {

	private source: BaseSelector = null;
	private target: BaseSelector = null;
	private delay: number = 1000;

	constructor(source: BaseSelector, target: BaseSelector) {
		super();
		this.source = source;
		this.target = target;
	}

	public execute(callback: (message: string) => void): void {
		this.source.select((source: JQuery, message: string) => {
			if (source !== null) {

				let position = PointerPosition.getInstance();
				position.centerToCallback(source, this.delay, () => {

					let origin = source[0].getBoundingClientRect();
					let x = origin.x;
					let y = origin.y;
					this.target.select((target: JQuery, message: string) => {
						if (target !== null) {

							let simulator = new DragDropSimulator(source[0], target[0],
								(dx: number, dy: number) => {
									x += dx;
									y += dy;
									position.dragged();
									position.setOffset(x + origin.width / 2, y + origin.height / 2);
								});
							simulator.move(() => {
								position.dropped();
								callback(null);
							});


						} else {
							callback(message);
						}
					});
				});
			} else {
				callback(message);
			}
		});
	}

}