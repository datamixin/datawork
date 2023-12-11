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
package com.andia.mixin.base;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.andia.mixin.value.MixinError;

public abstract class BaseError implements MixinError {

	private String code;
	private String message;
	private String stackTrace;

	public BaseError() {

	}

	public BaseError(Throwable e) {
		readMessage(e);
		readStackTrace(e);
	}

	public BaseError(String message) {
		this.message = message;
	}

	public BaseError(String code, String message) {
		this.code = code;
		this.message = message;
	}

	private void readMessage(Throwable exception) {
		this.message = exception.getMessage();
		if (this.message == null) {
			Class<?> eClass = exception.getClass();
			this.message = eClass.getSimpleName();
		}
	}

	private void readStackTrace(Throwable exception) {
		stackTrace = getStackTrace(exception);
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Override
	public String getFeatureCode() {
		return code;
	}

	@Override
	public String getMessage() {
		return message;
	}

	@Override
	public String getStackTrace() {
		return stackTrace;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public void setStackTrace(String stackTrace) {
		this.stackTrace = stackTrace;
	}

	public static String getStackTrace(Throwable throwable) {
		StringWriter stringWriter = new StringWriter();
		PrintWriter printWriter = new PrintWriter(stringWriter);
		throwable.printStackTrace(printWriter);
		return stringWriter.toString();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		result = prime * result + ((message == null) ? 0 : message.hashCode());
		result = prime * result + ((stackTrace == null) ? 0 : stackTrace.hashCode());
		return result;
	}

}
