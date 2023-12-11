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
import Initiator from "malang/directors/initiators/Initiator";
import InitiatorRegistry from "malang/directors/initiators/InitiatorRegistry";

import AutomatedLearningInitiator from "malang/directors/initiators/AutomatedLearningInitiator";
import BasicSupervisedLearningInitiator from "malang/directors/initiators/BasicSupervisedLearningInitiator";

export {

	Initiator,
	InitiatorRegistry,

	AutomatedLearningInitiator,
	BasicSupervisedLearningInitiator,

}
