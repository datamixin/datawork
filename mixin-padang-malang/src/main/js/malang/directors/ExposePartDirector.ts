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
export let EXPOSE_PART_DIRECTOR = "expose-part-director";

import Point from "webface/graphics/Point";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XModeler from "malang/model/XModeler";

import PreloadPanel from "malang/panels/PreloadPanel";

import Preload from "malang/directors/preloads/Preload";

export interface ExposePartDirector {

	getPreload(name: string): Preload;

	listPreloads(model: XModeler, callback: (preloads: Preload[]) => void): void;

	loadPreloadResult(name: string, size: Point, callback: (panel: PreloadPanel) => void): void;

}

export function getExposePartDirector(host: Controller | PartViewer): ExposePartDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ExposePartDirector>viewer.getDirector(EXPOSE_PART_DIRECTOR);
}

export default ExposePartDirector;