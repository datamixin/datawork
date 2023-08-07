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
import ListSelectionDialog from "webface/dialogs/ListSelectionDialog";

import HomeMenu from "bekasi/ui/HomeMenu";
import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";
import TutorialRegistry from "bekasi/ui/tutorials/TutorialRegistry";

export default class TutorialMenu extends HomeMenu {

	public getLabel(): string {
		return "Tutorial Project";
	}

	public getIcon(): string {
		return "mdi-school-outline";
	}

	public getDescription(): string {
		return "Create sample tutorial project automatically";
	}

	public run(_selector: ConsolePageSelector): void {
		let dialog = new ListSelectionDialog();
		let registry = TutorialRegistry.getInstance();
		let labels = registry.getLabels();
		dialog.setWindowTitle("Tutorials");
		dialog.setPrompt("Please select a tutorial");
		dialog.setInput(labels);
		dialog.open((result: string) => {
			if (result === ListSelectionDialog.OK) {
				let selection = dialog.getFirstSelection();
				let tutorial = registry.getByLabel(selection);
				tutorial.execute();
			}
		});
	}

}