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
package com.andia.mixin.padang.dumai.anchors;

import java.util.ArrayList;
import java.util.List;

import com.andia.mixin.rmo.OutsetException;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SMember;
import com.andia.mixin.sleman.api.SPointer;
import com.andia.mixin.sleman.api.SReference;
import com.andia.mixin.sleman.api.SText;
import com.andia.mixin.sleman.model.XAlias;
import com.andia.mixin.util.ArrayUtils;

public abstract class OriginAnchor {

	private OriginAnchor parent;

	public OriginAnchor() {
	}

	public OriginAnchor(OriginAnchor parent) {
		this.parent = parent;
	}

	protected abstract String getPathName();

	protected abstract boolean isExists(String child);

	public String[] getPath() {
		String[] path = new String[0];
		if (parent != null) {
			path = parent.getPath();
		}
		String name = this.getPathName();
		path = ArrayUtils.push(path, name);
		return path;
	}

	public String[] getFullPath(SPointer pointer) {

		// Full path
		SPointer current = pointer;
		List<String> names = new ArrayList<>();
		while (current instanceof SMember) {
			SMember member = (SMember) current;
			current = member.getObject();
			SExpression property = member.getProperty();
			if (property instanceof SReference) {
				SReference reference = (SReference) property;
				String name = reference.getName();
				names.add(0, name);
			} else if (property instanceof SText) {
				SText text = (SText) property;
				String value = text.getValue();
				names.add(0, value);
			}
		}

		if (current instanceof SReference) {

			// Reference, cari top most reference di origin
			SReference reference = (SReference) current;
			String top = reference.getName();
			names.add(0, top);
			OriginAnchor parent = this;
			while (parent != null) {
				if (parent.isExists(top)) {
					break;
				}
				parent = parent.parent;
			}

			// Full path
			String[] parentPath = new String[0];
			if (parent != null) {
				parentPath = parent.getPath();
			}
			String[] pointerPath = names.toArray(new String[0]);
			String[] fullPath = ArrayUtils.push(parentPath, pointerPath);
			return fullPath;

		} else if (current instanceof XAlias) {

			XAlias alias = (XAlias) current;
			String top = alias.getName();
			names.add(0, top);
			String[] pointerPath = names.toArray(new String[0]);
			return pointerPath;

		} else {
			throw new OutsetException("Unexpected current expresssion " + current);
		}

	}

}
