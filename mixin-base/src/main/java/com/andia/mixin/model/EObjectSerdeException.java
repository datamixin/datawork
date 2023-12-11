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
package com.andia.mixin.model;

/**
 * Kesalahan terjadi saat proses transformasi model.
 * 
 * @author "Jon Andika"
 * 
 */
public class EObjectSerdeException extends Exception {

	/**
	 * Kebutuhan serializable.
	 */
	private static final long serialVersionUID = -4390088596426509511L;

	public EObjectSerdeException(String s) {
		super(s);
	}

	/**
	 * Kesalahan disebabkan kesalahan yang lain.
	 * 
	 * @param s pesan kesalahan.
	 * @param e penyebab kesalahan.
	 */
	public EObjectSerdeException(String s, Throwable e) {
		super(s, e);
	}

}
