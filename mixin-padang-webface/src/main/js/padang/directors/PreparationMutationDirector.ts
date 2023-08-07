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
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export let PREPARATION_MUTATION_DIRECTOR = "preparation-mutation-director";

import XDisplay from "padang/model/XDisplay";
import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";

import Interaction from "padang/interactions/Interaction";

import TabularPrepareController from "padang/controller/prepare/TabularPrepareController";

export interface PreparationMutationDirector {

	getSelectionIndex(): number;

	computeResult(model: XPreparation, callback?: () => void): void;

	getInteractionCaption(model: XMutation): string;

	createResetDisplayCommand(display: XDisplay): Command;

	openInstoreComposer(controller: Controller, mutation: XMutation): void;

	createMutationCommand(controller: TabularPrepareController,
		preparation: XPreparation, interaction: Interaction, cutoff: boolean): Command;

}

export function getPreparationMutationDirector(host: Controller | PartViewer): PreparationMutationDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <PreparationMutationDirector>viewer.getDirector(PREPARATION_MUTATION_DIRECTOR);
}

export default PreparationMutationDirector;

