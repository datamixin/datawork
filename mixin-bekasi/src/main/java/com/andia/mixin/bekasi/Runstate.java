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
package com.andia.mixin.bekasi;

import java.util.UUID;

import com.andia.mixin.model.EObject;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.rmo.Regulator;

/**
 * Berikut adalah state transition dan operation yang dapat di lakukan.
 * 
 * <pre>
 * ┌─────────┬──────────┬───────────┬────────────────────────────────────────────┐
 * │ Former  │ Latter   │ Operation │ Description                                │
 * ├─────────┼──────────┼───────────┼────────────────────────────────────────────┤
 * │         │ Untitled │ Cancel    │ Cancel all created                         │
 * │         │          │ SaveAs    │ Commit all created                         │
 * ├─────────┼──────────┼───────────┼────────────────────────────────────────────┤
 * │ Stored  │ Edited   │ Save      │ Commit all created delete all removed      │
 * │         │          │ SaveAs    │ Commit all created and restore source file │
 * │         │          │ Revert    │ Restore source file                        │
 * ├─────────┼──────────┼───────────┼────────────────────────────────────────────┤
 * │ Stored  │ Loaded   │ Delete    │ Valid for not edited file                  │
 * ├─────────┼──────────┼───────────┼────────────────────────────────────────────┤
 * │ Stored  │ Loaded   │ Duplicate │ Valid for not edited file                  │
 * └─────────┴──────────┴───────────┴────────────────────────────────────────────┘
 * </pre>
 * 
 * @author jon
 *
 */
public interface Runstate {

	public Lifestage getFilestage();

	public void setModel(EObject model);

	public EObject getModel();

	public Regulator getRegulator();

	public void build() throws RunstateException;

	public void cutoff() throws RunstateException;

	public void save() throws RunstateException;

	public Runstate saveAs(UUID folderId, String newName) throws RunstateException;

	public void revert() throws RunstateException;

	public void delete() throws RunstateException;

	public void rename() throws RunstateException;

	public void modify(Modification rectification);

	public Runstate copyTo(UUID targetFileId) throws RunstateException;

	public Object checkupState(FeatureCall call) throws RunstateException;

	public Object inspectValue(FeatureCall call) throws RunstateException;

	public Object performAction(FeatureCall call) throws RunstateException;

	public <T> T getFacility(Class<? extends T> facilityClass);

}
