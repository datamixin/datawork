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
package com.andia.mixin.bekasi;

import java.util.Collection;
import java.util.UUID;

import com.andia.mixin.bekasi.resources.RunstackFile;
import com.andia.mixin.model.EObject;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.Modification;

/**
 * Memegang semua notebook yang loaded atau berjalan. File dikenali dengan key
 * yang berupa nama file untitled (sementara) atau fileId (identitas fiel yang
 * tersimpan).
 * 
 * @author jon
 *
 */
public interface Runstack extends Openstack {

	/**
	 * Buat untitled notebook baru dengan nama tersebut. File hanya terikat ke satu
	 * space saja. Berikut kondisi dengan {@link RunstackFile} yang
	 * dikembalikan:<br>
	 * <ol>
	 * <li>{@link RunstackFile#getParentId()} null, belum ada di sebuah folder
	 * <li>{@link RunstackFile#isUntitled()} false, belum tersimpan di repository
	 * <li>{@link RunstackFile#isCommitted()} true, belum ada model yang di set
	 * <ol>
	 * Semua variable yang dibuat akan memiliki stage created dan dapat di commit
	 * atau di cancel, sesuai kondisi akhir notebook di save-as atau di remove.
	 * 
	 * @param name nama file untitled dan harus unique dengan sudah ada, gunakan
	 *             {@link #getUntitledNameList()} untuk mandaftarkan daftar nama
	 *             untitled yang sudah ada.
	 * @return runstack file
	 */
	public RunstackFile createUntitled(String name);

	/**
	 * Ambil nama daftar notebook yang untitled yang dibuat dengan
	 * {@link #createUntitled(String)} dan belum di
	 * {@link #saveFileAs(String, String, String)}.
	 * 
	 * @return daftar nama runstact file
	 */
	public String[] getUntitledNameList();

	/**
	 * Lakukan proses pembatalan pembuatan notebook dengan menghapus untitled dan
	 * semua variable yang telah terbuat akan di cancel atau di delete.
	 * 
	 * @param fileId identitas file untitled
	 */
	public boolean cancelUntitled(UUID fileId);

	/**
	 * Buka file yang sudah tersimpan di repository dan tambahkan kedalam daftar
	 * opened file. Lihat {@link #getOpenedList()} untuk melihat daftar file yang
	 * sudah terbuka.
	 * 
	 * @param fileId file id
	 * @return
	 */
	public RunstackFile openFile(UUID fileId);

	/**
	 * Tutup file yang sedang terbuka dan hapus dari daftar opened.
	 * 
	 * @param fileId identitas file yang akan di tutup
	 * @return true jika file tertutup
	 */
	public boolean closeFile(UUID fileId);

	/**
	 * Ambil daftar file yang terbuka yang isinya sesuai dengan perjalanan proses
	 * {@link #createUntitled(String)} dan {@link #cancelUntitled(String)} serta
	 * {@link #openFile(String)}.
	 * 
	 * @return
	 */
	public Collection<RunstackFile> getOpenedList();

	/**
	 * Ambil file untuk mengetahui detail informasi file yang ada di runstack.
	 * 
	 * @param fileId pengenal file di runstack.
	 * @return
	 */
	public RunstackFile getFile(UUID fileId);

	/**
	 * Simpan file yang telah di edit. Semua variable yang created akan di commit
	 * menjadi stage onsaved dan semua variable yang stage removed akan di deleted
	 * dari storage.
	 * 
	 * @param fileId identitas file nodebook didalam repository
	 * @return file hasil save dengan status committed menjadi true
	 * @throws RunstackException
	 */
	public RunstackFile saveFile(UUID fileId);

	/**
	 * Simpan file dengan key tersebut menjadi file dengan nama baru newName di
	 * folderId tersebut. <br>
	 * <ul>
	 * <li>Jika notebook adalah untitled maka untuk variable yang created akan di
	 * commit berubah menjadi onsaved. <br>
	 * <li>Jika notebook adalah hasil proses edit dari notebook yang sudah persisted
	 * maka akan ada dua proses.
	 * <ol>
	 * <li>Proses revert dimana semua variable yang removed karena retire akan di
	 * rejoin kembali dan semua variable yang created akan di cancel atau di hapus.
	 * <li>Proses save-as dimana semua variable onsaved dari notebook awal akan di
	 * copy menjadi variable baru dan langsung menjadi onsaved dan variable baru
	 * yang dibuat selama edit atau created akan di commit menjadi onsaved.
	 * </ol>
	 * </ul>
	 * 
	 * @param fileId   file identity di repository
	 * @param folderId folder id untuk tempat file baru
	 * @param newName  nama fiel bru
	 * @return fiel hasil save-as
	 * @throws RunstackException
	 */
	public RunstackFile saveFileAs(UUID fileId, UUID folderId, String newName);

	/**
	 * Kembalikan kondisi model sebelum di edit dan semua variable serta isinya
	 * kembali seperti semula. Semua variable yang terbuat di batalkan atau di
	 * cancel dan semua variable yang retire di rejoin kembali.
	 * 
	 * @param fileId identitias file
	 * @return file setelah revert dengan status committed true dan persisted true
	 * @throws RunstackException
	 */
	public RunstackFile revertFile(UUID fileId) throws RunstackException;

	/**
	 * Ambil model yang sedang ada didalam daftar opened.
	 * 
	 * @param fileId identitas file
	 * @return
	 */
	public EObject getModel(UUID fileId);

	/**
	 * Berikan model ke notebook yang sedang terbuka dan otomatis akan menjadikan
	 * runstack file menjadi committed false.
	 * 
	 * @param fileId file runstack yang untitled atau yang sudah persisted
	 * @param model  model notebook baru
	 */
	public void setModel(UUID fileId, EObject model);

	/**
	 * Terapkan modifikasi ke dalam notebook yang sedang terbuka sesuai order
	 * tersebut.
	 * 
	 * @param fileId     file id notebook yang sedang terbuka
	 * @param modifikasi modifikasi
	 */
	public void applyModification(UUID fileId, Modification modification);

	/**
	 * Ambil nilai hasil pemeriksaan regulator sesuai dengan feature call tersebut.
	 * 
	 * @param uuid
	 * @param call
	 * @return
	 */
	public Object checkupState(UUID uuid, FeatureCall call);

	/**
	 * Ambil nilai hasil pemeriksaan sebuah outset bersama dengan arguments-nya yang
	 * diwakilkan oleh feature call tersebut.
	 * 
	 * @param fileId identitas notebook yang sedang terbuka.
	 * @param call   pemanggil feature di notebook model
	 * @return nilai yang didapat dari hasil pemeriksaan model
	 */
	public Object inspectValue(UUID fileId, FeatureCall call);

	/**
	 * Lakukan action di feature path tersebut menggunakan nama perform tersebut.
	 * 
	 * @param uuid
	 * @param call
	 */
	public Object performAction(UUID fileId, FeatureCall call);

	/**
	 * Ambil fasilitas yang dapat digunakan untuk fileId tersebut
	 * 
	 * @param <T>
	 * @param fileId
	 * @param facilityClass
	 * @return
	 */
	public <T> T getFacility(UUID fileId, Class<? extends T> facilityClass);

}
