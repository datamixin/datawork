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
import ContentViewer from "webface/wef/ContentViewer";
import RootController from "webface/wef/RootController";
import ControllerViewer from "webface/wef/ControllerViewer";
import ControllerFactory from "webface/wef/ControllerFactory";

import BasePartViewer from "webface/wef/base/BasePartViewer";

export abstract class BaseControllerViewer extends BasePartViewer implements ControllerViewer, ContentViewer {

	private controllerFactory: ControllerFactory;
	private properties = new Map<string, any>();

	public setControllerFactory(controllerFactory: ControllerFactory): void {
		this.controllerFactory = controllerFactory;
	}

	public getControllerFactory(): ControllerFactory {
		return this.controllerFactory;
	}

	public getProperty(name: string): any {
		return this.properties.get(name);
	}

	public setProperty(name: string, value: any): void {
		this.properties.set(name, value);
	}

	abstract getRootController(): RootController;

	abstract setContents(model: any): void;

}

export default BaseControllerViewer;