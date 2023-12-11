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
export default class VegaliteNode {

	private chart: JQuery = null;
	private element: Element = null;
	private children: VegaliteNode[] = [];

	constructor(chart: JQuery, element: Element) {
		this.chart = chart;
		this.element = element;
	}

	public getChart(): JQuery {
		return this.chart;
	}

	public getElement(): Element {
		return this.element;
	}

	public addChild(node: VegaliteNode): void {
		this.children.push(node);
	}

	public getChildren(): VegaliteNode[] {
		return this.children;
	}

	public getBoundingRect(): DOMRect {
		return this.element.getBoundingClientRect();
	}

}
