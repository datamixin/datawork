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
package com.andia.mixin.bekasi.visage;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.andia.mixin.value.MixinError;

public class VisageError extends VisageValue implements MixinError {

	private String message;
	private String stackTrace;
	private String featureCode;

	public VisageError() {
		super(VisageError.class);
	}

	public VisageError(String message) {
		this();
		this.message = message;
	}

	public VisageError(Throwable exception) {
		this();
		readException(exception);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		if (source instanceof Throwable) {
			Throwable throwable = (Throwable) source;
			readException(throwable);
		} else if (source instanceof MixinError) {
			MixinError error = (MixinError) source;
			this.featureCode = error.getFeatureCode();
			this.message = error.getMessage();
			this.stackTrace = error.getStackTrace();
		} else {
			this.message = "ResultError not known source type";
		}
	}

	private void readException(Throwable throwable) {
		readMessage(throwable);
		readStackTrace(throwable);
	}

	private void readMessage(Throwable throwable) {
		this.message = throwable.getMessage();
		if (this.message == null) {
			Class<?> eClass = throwable.getClass();
			this.message = eClass.getSimpleName();
		}
	}

	private void readStackTrace(Throwable exception) {
		StringWriter stringWriter = new StringWriter();
		PrintWriter printWriter = new PrintWriter(stringWriter);
		exception.printStackTrace(printWriter);
		stackTrace = stringWriter.toString();
	}

	public String getMessage() {
		return message;
	}

	public String getStackTrace() {
		return stackTrace;
	}

	@Override
	public String getFeatureCode() {
		return featureCode;
	}

	@Override
	public String info() {
		return "{@class:Error, message:'" + message + "'}";
	}

	@Override
	public String toString() {
		return "VisageError(" + message + ")";
	}

}
