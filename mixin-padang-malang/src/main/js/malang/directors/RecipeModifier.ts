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
import Controller from "webface/wef/Controller";
import CommandGroup from "webface/wef/CommandGroup";

export default class RecipeModifier {

	public isAffective(): boolean {
		return false;
	}

	public addFeature(_formula: string, _position: number, _type: string): void {

	}

	public moveFeature(_formula: string, _position: number): void {

	}

	public removeFeature(_formula: string): void {

	}

	public getMutationSteps(): string[] {
		return [];
	}

	public addCommand(_group: CommandGroup): void {

	}

	public executeCommand(_controller: Controller): void {

	}

}
