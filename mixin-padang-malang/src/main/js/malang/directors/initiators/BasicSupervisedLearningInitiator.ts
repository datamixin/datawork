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
import MalangCreator from "malang/model/MalangCreator";
import XSupervisedLearning from "malang/model/XSupervisedLearning";

import BuilderPartViewer from "malang/ui/BuilderPartViewer";

import Initiator from "malang/directors/initiators/Initiator";
import InitiatorRegistry from "malang/directors/initiators/InitiatorRegistry";

export default class BasicSupervisedLearningInitiator extends Initiator {

	public createNew(_viewer: BuilderPartViewer): XSupervisedLearning {
		let creator = MalangCreator.eINSTANCE;
		return creator.createBasicSupervisedLearning();
	}

}

let registry = InitiatorRegistry.getInstance();
registry.register(XSupervisedLearning.XCLASSNAME, new BasicSupervisedLearningInitiator());