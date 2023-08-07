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
import LeanControllerFactory from "bekasi/controller/LeanControllerFactory";

import XOutlook from "vegazoo/model/XOutlook";
import XVegalite from "vegazoo/model/XVegalite";

import OutlookTopbarController from "vegazoo/controller/topbar/OutlookTopbarController";
import VegaliteTopbarController from "vegazoo/controller/topbar/VegaliteTopbarController";

export default class TopbarControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		super.register(XOutlook.XCLASSNAME, OutlookTopbarController);
		super.register(XVegalite.XCLASSNAME, VegaliteTopbarController);

	}

}