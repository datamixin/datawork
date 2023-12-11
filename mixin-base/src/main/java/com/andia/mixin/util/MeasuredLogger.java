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
package com.andia.mixin.util;

import org.slf4j.Logger;

public class MeasuredLogger {

	private Logger logger;
	private long starttime;

	public MeasuredLogger(Logger logger) {
		this.logger = logger;
		this.starttime = System.currentTimeMillis();
	}

	public void debugMeasuredIn(String message) {

		long lasttime = System.currentTimeMillis();
		long elapses = lasttime - starttime;

		Runtime runtime = Runtime.getRuntime();
		long freeMemory = runtime.freeMemory();

		logger.debug(message + " elapsed in " + elapses + " ms with free memory " + freeMemory);
	}

	public void error(String message, Exception exception) {
		logger.error(message, exception);
	}
}
