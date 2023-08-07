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
import EObject from "webface/model/EObject";

export let OVERLAY = "overlay";
export let DATASET = "dataset";
export let FIELD = "field";
export let DATUM = "datum";

export let DEFAULT_WIDTH = 320;
export let DEFAULT_HEIGHT = 240;

export function getCapitalizedContainingFeatureName(model: EObject): string {
	let name = getContainingFeatureName(model);
	let firstChar = name[0].toUpperCase();
	let capitalize = firstChar + name.substring(1);
	return capitalize;
}

export function getContainingFeatureName(model: EObject): string {
	let feature = model.eContainingFeature();
	return feature.getName();
}

export {

}