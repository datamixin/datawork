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
import InputValidator from "webface/dialogs/InputValidator";

export default class NameInputValidator implements InputValidator {

    private strings: string[] = [];

    constructor(strings: string[]) {
        this.strings = strings;
    }

    public validate(text: string): string {
        if (!text) {
            return "Name not defined";
        }
        if (text === "") {
            return "Name cannot be blank";
        }
        for (var i = 0; i < this.strings.length; i++) {
            if (this.strings[i] === text) {
                return "Name '" + text + "' already exists";
            }
        }
        return null;
    }
}
