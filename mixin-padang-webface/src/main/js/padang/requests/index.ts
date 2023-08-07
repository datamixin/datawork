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
import * as findout from "padang/requests/findout";
import * as instore from "padang/requests/instore";
import * as toolbox from "padang/requests/toolbox";
import * as toolset from "padang/requests/toolset";
import * as outline from "padang/requests/outline";
import * as present from "padang/requests/present";
import * as prepare from "padang/requests/prepare";
import * as anatomy from "padang/requests/anatomy";
import * as explain from "padang/requests/explain";
import * as overtop from "padang/requests/overtop";

import DatasetAddRequest from "padang/requests/DatasetAddRequest";
import OutcomeAddRequest from "padang/requests/OutcomeAddRequest";

import FrameworkListRequest from "padang/requests/FrameworkListRequest";
import FrameworkDetailRequest from "padang/requests/FrameworkDetailRequest";

import FormulaParseRequest from "padang/requests/FormulaParseRequest";
import FormulaFormatRequest from "padang/requests/FormulaFormatRequest";
import FormulaCommitRequest from "padang/requests/FormulaCommitRequest";
import FormulaEvaluateRequest from "padang/requests/FormulaEvaluateRequest";
import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";
import VariableNameListRequest from "padang/requests/VariableNameListRequest";
import VariableFormulaSetRequest from "padang/requests/VariableFormulaSetRequest";
import VariableNameValidationRequest from "padang/requests/VariableNameValidationRequest";

import FigureCreateRequest from "padang/requests/FigureCreateRequest";
import BuilderCreateRequest from "padang/requests/BuilderCreateRequest";
import OutcomeCreateRequest from "padang/requests/OutcomeCreateRequest";

import ContentRelayoutRequest from "padang/requests/ContentRelayoutRequest";

import FacetPropertySetRequest from "padang/requests/FacetPropertySetRequest";
import FacetPropertyGetRequest from "padang/requests/FacetPropertyGetRequest";

import BufferedProvisionRequest from "padang/requests/BufferedProvisionRequest";

import UploadFileListRequest from "padang/requests/UploadFileListRequest";
import SampleFileContentRequest from "padang/requests/SampleFileContentRequest";

import ReferenceNameListRequest from "padang/requests/ReferenceNameListRequest";

import TabularRowSelectRequest from "padang/requests/TabularRowSelectRequest";
import TabularCellSelectRequest from "padang/requests/TabularCellSelectRequest";
import TabularColumnSelectRequest from "padang/requests/TabularColumnSelectRequest";
import TabularTopOriginChangeRequest from "padang/requests/TabularTopOriginChangeRequest";
import TabularLeftOriginChangeRequest from "padang/requests/TabularLeftOriginChangeRequest";

import TabularColumnProfileRequest from "padang/requests/TabularColumnProfileRequest";
import TabularColumnWidthSetRequest from "padang/requests/TabularColumnWidthSetRequest";
import TabularColumnWidthGetRequest from "padang/requests/TabularColumnWidthGetRequest";
import TabularColumnFormatGetRequest from "padang/requests/TabularColumnFormatGetRequest";
import TabularColumnInspectResetRequest from "padang/requests/TabularColumnInspectResetRequest";
import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";
import TabularColumnFrequencySortRequest from "padang/requests/TabularColumnFrequencySortRequest";

import OutcomeFormulaListRequest from "padang/requests/OutcomeFormulaListRequest";
import OutcomeFormulaResultRequest from "padang/requests/OutcomeFormulaResultRequest";

import ParameterDefaultValueRequest from "padang/requests/ParameterDefaultValueRequest";

import CredentialRemoveRequest from "padang/requests/CredentialRemoveRequest";
import CredentialNameListRequest from "padang/requests/CredentialNameListRequest";
import CredentialOptionsSaveRequest from "padang/requests/CredentialOptionsSaveRequest";
import CredentialOptionsLoadRequest from "padang/requests/CredentialOptionsLoadRequest";

import DatasetPreparationSampleSelectRequest from "padang/requests/DatasetPreparationSampleSelectRequest";
import DatasetPreparationUploadSelectRequest from "padang/requests/DatasetPreparationUploadSelectRequest";
import DatasetPreparationStarterSelectRequest from "padang/requests/DatasetPreparationStarterSelectRequest";
import DatasetPreparationStarterComposeRequest from "padang/requests/DatasetPreparationStarterComposeRequest";

export {

	findout,
	instore,
	toolbox,
	toolset,
	outline,
	present,
	prepare,
	anatomy,
	explain,
	overtop,

	DatasetAddRequest,
	OutcomeAddRequest,

	FrameworkListRequest,
	FrameworkDetailRequest,

	FormulaParseRequest,
	FormulaFormatRequest,
	FormulaCommitRequest,
	FormulaEvaluateRequest,
	FormulaAssignableRequest,
	FormulaValidationRequest,

	VariableNameSetRequest,
	VariableNameListRequest,
	VariableFormulaSetRequest,
	VariableNameValidationRequest,

	ContentRelayoutRequest,

	FigureCreateRequest,
	BuilderCreateRequest,
	OutcomeCreateRequest,

	FacetPropertySetRequest,
	FacetPropertyGetRequest,

	UploadFileListRequest,
	SampleFileContentRequest,

	BufferedProvisionRequest,

	ReferenceNameListRequest,

	TabularRowSelectRequest,
	TabularCellSelectRequest,
	TabularColumnSelectRequest,
	TabularTopOriginChangeRequest,
	TabularLeftOriginChangeRequest,

	TabularColumnProfileRequest,
	TabularColumnWidthSetRequest,
	TabularColumnWidthGetRequest,
	TabularColumnFormatGetRequest,
	TabularColumnInspectApplyRequest,
	TabularColumnInspectResetRequest,
	TabularColumnFrequencySortRequest,

	OutcomeFormulaListRequest,
	OutcomeFormulaResultRequest,

	ParameterDefaultValueRequest,

	CredentialRemoveRequest,
	CredentialNameListRequest,
	CredentialOptionsSaveRequest,
	CredentialOptionsLoadRequest,

	DatasetPreparationSampleSelectRequest,
	DatasetPreparationUploadSelectRequest,
	DatasetPreparationStarterSelectRequest,
	DatasetPreparationStarterComposeRequest,

}