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
import Command from "webface/wef/Command";

import XMixture from "padang/model/XMixture";
import XViewset from "padang/model/XViewset";

export default class ViewsetMixtureSetCommand extends Command {

	private viewset: XViewset = null;
	private oldMixture: XMixture = null;
	private newMixture: XMixture = null;

	public setViewset(viewset: XViewset): void {
		this.viewset = viewset;
	}

	public setMixture(mixture: XMixture): void {
		this.newMixture = mixture;
	}

	public execute(): void {
		this.oldMixture = this.viewset.getMixture();
		this.viewset.setMixture(this.newMixture);
	}

	public undo(): void {
		this.viewset.setMixture(this.oldMixture);
	}

	public redo(): void {
		this.viewset.setMixture(this.newMixture);
	}

}