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
import * as functions from "webface/util/functions";

import StarterRegistry from "bekasi/StarterRegistry";

export let CELL = "cell";
export let PROJECT = "project";

export let CLIENT = "client";
export let SERVER = "server";
export let FORMATION = "formation";
export let EXPLANATION = "explanation";

export let ENGINE = "engine";
export let PROJECTS = "Projects";

export let FILE_ICON = "mdi-file-cad";

export let FIELD_TYPE = "fieldType";
export let FIELD_KIND = "fieldKind";
export let FIELD_FORMULA = "fieldFormula";
export let FIELD_PRESUME = "fieldPresume";

export let FIELD_KIND_COUNT = "fieldKindCount";
export let FIELD_KIND_VALUE = "fieldKindValue";

export let PROBLEM_LIST = "problem-list";
export let PROBLEM_COUNTER = "problem-counter";

export let COLOR_TEXT = "#444";
export let COLOR_NUMBER = "#844";
export let COLOR_LOGICAL = "#44C";
export let COLOR_DEFAULT = "#888";
export let COLOR_TIMESTAMP = "#48C";

export let DRAG_SOURCE = "dragSource";
export let DRAG_TARGET = "dragTarget";
export let NEW_POSITION = "newPosition";
export let SOURCE_POSITION = "sourcePosition";
export let TARGET_POSITION = "targetPosition";

export let IMAGE_CAMERA_SOURCE = "ImageCameraSource";
export let IMAGE_FOLDER_SOURCE = "ImageFolderSource";

export let INSPECT_ONMOVE = "inspect-onmove";
export let INSPECT_RESULT = "inspect-result";
export let INSPECT_POINTED = "inspect-pointed";
export let INSPECT_COMPUTE = "inspect-compute";
export let INSPECT_EXECUTE = "inspect-execute";
export let INSPECT_EVALUATE = "inspect-evaluate";
export let INSPECT_RESULT_AT = "inspect-result-at";
export let INSPECT_APPLY_RESULT = "inspect-apply-result";
export let INSPECT_EXPORT_RESULT = "inspect-export-result";
export let INSPECT_EXPORT_FORMAT_LIST = "inspect-export-format-list";

export let NULL = "null";
export let ERROR = "error";
export let NULL_FLAG = "__nulls__";
export let EXISTS_FLAG = "__exists__";
export let DISTINCTS_FLAG = "__distincts__";

export let DATASET = "dataset";
export let DISPLAY = "display";

export let COLUMN = "column";
export let WIDTH = "width";
export let FORMAT = "format";
export let PREFACE = "preface";
export let OUTLINE = "outline";

export let EXPERIMENT_STATE = "state";
export let EXPERIMENT_STATE_ELAPSED = "elapsed";
export let EXPERIMENT_STATE_KEY_CREATED = "created";
export let EXPERIMENT_STATE_KEY_RUNNING = "running";
export let EXPERIMENT_STATE_KEY_COMPLETED = "completed";
export let EXPERIMENT_STATE_KEY_CANCELLED = "cancelled";

export let PRIVILAGE_PRO = "pro";

export let CLIENT_ID = functions.randomUUID();

export let COLUMN_TYPE_MAP = {
	TEXT: <ColumnType>{ name: "TEXT", index: 1, label: "Text", icon: "mdi-alphabetical-variant" },
	NUMBER: <ColumnType>{ name: "NUMBER", index: 2, label: "Number", icon: "mdi-numeric" },
	LOGICAL: <ColumnType>{ name: "LOGICAL", index: 3, label: "Logical", icon: "mdi-toggle-switch" },
	BYTES: <ColumnType>{ name: "BYTES", index: 4, label: "Bytes", icon: "mdi-file-image-outline" },
}

export let COLUMN_TYPE_VALUES: ColumnType[] = [];
export let COLUMN_KEYS = Object.keys(COLUMN_TYPE_MAP);
for (let key of COLUMN_KEYS) {
	COLUMN_TYPE_VALUES.push(COLUMN_TYPE_MAP[key]);
}

export class ColumnType {

	public name: string;
	public index: number;
	public label: string;
	public icon: string;

}

let registry = StarterRegistry.getInstance();
registry.register((callback: () => void) => {
	callback();
});
