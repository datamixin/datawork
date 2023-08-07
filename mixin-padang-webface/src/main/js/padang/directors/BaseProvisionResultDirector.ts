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

import Controller from "webface/wef/Controller";

import { expressionFactory as factory } from "sleman/ExpressionFactory";

import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import Provision from "padang/provisions/Provision";

import Examination from "padang/directors/examinations/Examination";
import ClientExamination from "padang/directors/examinations/ClientExamination";
import ExaminationRegistry from "padang/directors/examinations/ExaminationRegistry";

import ProvisionResultDirector from "padang/directors/ProvisionResultDirector";

export default class BaseProvisionResultDirector implements ProvisionResultDirector {

	private createExamination(provision: Provision): Examination {
		let registry = ExaminationRegistry.getInstance();
		let examination = registry.get(provision);
		return examination;
	}

	public inspect(controller: Controller, provision: Provision, callback: (data: any) => void): void {

		let examination = this.createExamination(provision);
		let options = examination.createOptions(provision);

		let model = <EObject>controller.getModel();
		if (examination instanceof ClientExamination) {
			examination.inspectValue(model, provision, callback);
		} else {

			let display = factory.createLogical(provision.display);
			options[padang.DISPLAY] = display;

			let args = [provision.provisionName, options];
			this.inspectValue(controller, examination, padang.INSPECT_RESULT, args, callback);
		}

	}

	public inspectPreparationResultAt(controller: Controller, index: number,
		provision: Provision, callback: (data: any) => void): void {
		let examination = this.createExamination(provision);
		let options = examination.createOptions(provision);
		let args = [index, provision.provisionName, options];
		this.inspectValue(controller, examination, padang.INSPECT_RESULT_AT, args, callback);
	}

	private inspectValue(controller: Controller, examination: Examination,
		inspect: string, args: any[], callback: (data: any) => void) {
		let model = <EObject>controller.getModel();
		let director = directors.getProjectComposerDirector(controller);
		director.inspectValue(model, inspect, args,
			(value: VisageValue) => {
				if (value instanceof VisageError) {
					callback(value);
				} else {
					let response = examination.convertValue(value);
					callback(response);
				}
			}
		);
	}

}