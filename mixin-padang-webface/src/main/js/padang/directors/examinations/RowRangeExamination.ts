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
import VisageValue from "bekasi/visage/VisageValue";

import RowRange from "padang/functions/dataset/RowRange";

import Examination from "padang/directors/examinations/Examination";
import ExaminationRegistry from "padang/directors/examinations/ExaminationRegistry";

export default class RowRangeExamination extends Examination {

    public convertValue(value: VisageValue): any {
        return this.asRowMap(value);
    }

}

let registry = ExaminationRegistry.getInstance();
registry.register(RowRange.FUNCTION_NAME, new RowRangeExamination());