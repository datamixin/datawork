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
package com.andia.mixin.rmo;

/**
 * Mengendalikan jalannya model melalui regulator yang digunakan sebagai
 * pengatur outset.
 * 
 * @author jon
 *
 */
public interface Runmodel {

	/**
	 * Ambil factory untuk membuat {@link Regulator} dari setiap instance model.
	 * 
	 * @return
	 */
	public RegulatorFactory getRegulatorFactory();

	/**
	 * Ambil factory untuk membuat {@link Outset} dari setiap {@link Regulator}
	 * 
	 * @return
	 */
	public OutsetFactory getOutsetFactory();

	/**
	 * Ambil model yang di kendalikan oleh manager ini.
	 * 
	 * @return
	 */
	public Object getModel();

	/**
	 * Ambil supervisor yang paling tinggi didalam struktur
	 * 
	 * @return
	 */
	public Supervisor getSupervisor();

	/**
	 * Berikan capability ke runmodel
	 * 
	 * @param capabilityClass
	 * @param capability
	 */
	public void registerCapability(Class<?> capabilityClass, Object capability);

	/**
	 * Ambil kemampuan yang dimiliki oleh manager ini, kemampuan adalah apapun yang
	 * dimiliki.
	 * 
	 * @param capabilityClass
	 * @return
	 */
	public <C> C getCapability(Class<? extends C> capabilityClass);

	/**
	 * Lakukan pengiriman indication karena sesuai terjadi.
	 * 
	 * @param indication
	 */
	public void postIndication(Indication indication);

	/**
	 * Lakukan penyimpanan sementara hasil modifikasi yang berupa verification.
	 * 
	 * @param rectification
	 */
	public void postRectification(Modification rectification);

}
