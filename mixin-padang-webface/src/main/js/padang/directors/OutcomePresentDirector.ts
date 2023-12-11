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
export let OUTCOME_PRESENT_DIRECTOR = "outcome-present-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XOutcome from "padang/model/XOutcome";

import Frontage from "padang/directors/frontages/Frontage";

import FrontagePanel from "padang/view/present/FrontagePanel";

import OutcomePresentController from "padang/controller/present/OutcomePresentController";

export interface OutcomePresentDirector {

    computeResult(controller: OutcomePresentController, callback: () => void): void;

    createPresentPanel(controller: OutcomePresentController,
        callback: (type: string, panel: FrontagePanel) => void): void;

    getValueFrontage(outcome: XOutcome, callback: (frontage: Frontage) => void): void;

    getPromotedFormulas(current: Controller, callback: (formulas: Map<string, string>) => void): void;

    computeExample(current: Controller, formula: string, callback: (result: any) => void): void;
    
}

export function getOutcomePresentDirector(host: Controller | PartViewer): OutcomePresentDirector {
    let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
    return <OutcomePresentDirector>viewer.getDirector(OUTCOME_PRESENT_DIRECTOR);
}

export default OutcomePresentDirector;
