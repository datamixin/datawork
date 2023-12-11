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
package com.andia.mixin.sleman.model;

import com.andia.mixin.model.EFactory;

public interface SlemanFactory extends EFactory {

	public static SlemanFactory eINSTANCE = new BaseSlemanFactory();

	public XNull createXNull();

	public XText createXText();

	public XNumber createXNumber();

	public XLogical createXLogical();

	public XList createXList();

	public XAlias createXAlias();

	public XObject createXObject();

	public XReference createXReference();

	public XAssignment createXAssignment();

	public XIdentifier createXIdentifier();

	public XLet createXLet();

	public XCall createXCall();

	public XArgument createXArgument();

	public XUnary createXUnary();

	public XBinary createXBinary();

	public XMember createXMember();

	public XLambda createXLambda();

	public XForeach createXForeach();

	public XConditional createXConditional();

}
