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
export let CONSOLE_DIRECTOR = "console-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import RunstackFile from "bekasi/resources/RunstackFile";

import FullDeckPanel from "bekasi/directors/FullDeckPanel";
import ConsoleApplication from "bekasi/directors/ConsoleApplication";

export interface ConsoleDirector {

	logout(): void;

	setOnLogout(callback: () => void): void;

	getCurrentFileId(): string;

	getCurrentPartViewer(): PartViewer;

	registerApplication(application: ConsoleApplication): void;

	openFile(file: RunstackFile, callback: () => void): void;

	reopenOpenedFiles(callback: (files: number) => void): void;

	replaceFile(source: RunstackFile, target: RunstackFile): void;

	refreshFile(file: RunstackFile): void;

	openFullDeck(panel: FullDeckPanel, callback: (result: string) => void): void;

	markOpenedFiles(): void;

}

export function getConsoleDirector(host: Controller | PartViewer): ConsoleDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ConsoleDirector>viewer.getDirector(CONSOLE_DIRECTOR);
}

export default ConsoleDirector;

