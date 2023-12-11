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
export let PREPROCESSING_DIRECTOR = "preprocessing-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XPreprocessing from "malang/model/XPreprocessing";

export interface PreprocessingDirector {

	preparePreprocessingVariable(preprocessing: XPreprocessing, callback: () => void): void;

	openPreprocessingComposer(controller: Controller, preprocessing: XPreprocessing): void;

}

export function getPreprocessingDirector(host: Controller | PartViewer): PreprocessingDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <PreprocessingDirector>viewer.getDirector(PREPROCESSING_DIRECTOR);
}

export default PreprocessingDirector;