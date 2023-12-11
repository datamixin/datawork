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
import Conductor from "webface/wef/Conductor";

import WizardContainer from "webface/dialogs/WizardContainer";
import WizardDialogPage from "webface/dialogs/WizardDialogPage";

export abstract class BaseWizardDialogPage extends WizardDialogPage {

	protected conductor: Conductor = null;

	constructor(container: WizardContainer, conductor: Conductor, title: string) {
		super(container, title);
		this.conductor = conductor;
	}

}

export default BaseWizardDialogPage;