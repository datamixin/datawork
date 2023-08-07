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
package com.andia.mixin.raung;

import java.util.UUID;

public interface Repository {

	public static final long UNDEFINED_TIME = -1L;

	/**
	 * Load daftar item yang ada di root.
	 * 
	 * @return list daftar item yang ada di root
	 */
	public RepositoryItemList loadRootItemList();

	/**
	 * Apakah ada item dengan nama tersebut dibawah root langsung.
	 * 
	 * @param name nama item dibawah root
	 * @return true jika ada atau false jika sebaliknya
	 */
	public boolean isRootItemExists(String name);

	/**
	 * Buat root folder dengan nama tersebut.
	 * 
	 * @param name nama root folder yang harus unik di bawah root
	 * @return id folder yang baru dibuat
	 * @throws RepositoryException jika sudah ada item dengan nama yang sama di root
	 *                             folder
	 */
	public UUID createRootFolder(String name) throws RepositoryException;

	/**
	 * Beat root file dengan nama tersebut.
	 * 
	 * @param name nama root file yang harus unik di bawah root
	 * @return id file yang baru dibuat
	 * @throws RepositoryException jika sudah ada item dengan nama yang sama di root
	 *                             folder
	 */
	public UUID createRootFile(String name) throws RepositoryException;

	/**
	 * Buat folder baru di bawah folder dengan folderId tersebut
	 * 
	 * @param folderId folder id tempat folder yang baru
	 * @param name     nama folder yang harus unik dibawah folder id
	 * @return id untuk folder yang baru di buat
	 * @throws RepositoryException jika sudah ada item dengan nama yang sama di
	 *                             folder tersebut
	 */
	public UUID createFolder(UUID folderId, String name) throws RepositoryException;

	/**
	 * Buat file baru di bawah folder dengan folderId tersebut
	 * 
	 * @param folderId folder id tempat file yang bar
	 * @param name     nama file yang akan dibuat
	 * @return id untuk file yang baru di buat
	 * @throws RepositoryException jika sudah ada item dengan nama yang sama di
	 *                             folder tersebut
	 */
	public UUID createFile(UUID folderId, String name) throws RepositoryException;

	/**
	 * Load item list untuk folder id tersebut.
	 * 
	 * @param folderId folder id yang menampung items.
	 * @return list daftar item di bawah folder tersebut
	 */
	public RepositoryItemList loadItemList(UUID folderId);

	/**
	 * Load root item dengan nama tersebut. Root item dapat diambil bersadarkan nama
	 * karena hanya ada satu root item.
	 * 
	 * @param name nama dibawah root item.
	 * @return root item atau null jika tidak ada
	 */
	public RepositoryItem loadRootItem(String name);

	/**
	 * Load id untuk root item dengan nama tersebut.
	 * 
	 * @param name nama dibawah root item.
	 * @return id root item atau null jika tidak ada
	 */
	public UUID getRootItemId(String name);

	/**
	 * Load item berdasarkan item id tersebut.
	 * 
	 * @param itemId item id unique didalam repository.
	 * @return item sesuai id tersebut atau null jika tdak ditemukan.
	 */
	public RepositoryItem loadItem(UUID itemId);

	/**
	 * Di folder id tersebut load item dengan nama yang sesuai.
	 * 
	 * @param folderId folder id yang memiliki item anakan tersebut.
	 * @param name
	 * @return item yang sesuai atau null jika tidak ada
	 */
	public RepositoryItem loadItem(UUID folderId, String name);

	/**
	 * Ambil item id untuk name di bawah folder id
	 * 
	 * @param folderId parent folder id
	 * @param name     name yang di cari
	 * @return id jika ada atau null jika tidak ditemukan
	 */
	public UUID getItemId(UUID folderId, String name);

	/**
	 * Apakah ada item dengan itemId tersebut.
	 * 
	 * @param itemId item id
	 * @return true jika ada atau false jika sebaliknya
	 */
	public boolean isItemExists(UUID itemId);

	/**
	 * Di folder dengan folderId tersebut apakah ada item dibawahnya yang memiliki
	 * nama tersebut.
	 * 
	 * @param folderId folder id
	 * @param name     nama item yang bawah folder
	 * @return true jika ada atau false jika sebaliknya.
	 */
	public boolean isItemExists(UUID folderId, String name);

	/**
	 * Pindahkan item dengan itemId tersebut menjadi di bawah folder dengan folderId
	 * tersebut.
	 * 
	 * @param itemId   item id yang akan di pindahkan
	 * @param folderId folderId tempat item baru akan di tempatkan
	 * @return true jika proses pemindahan berhasil atau false jika sebaliknya
	 */
	public boolean moveItem(UUID itemId, UUID folderId);

	/**
	 * Lakukan proses copy content file id tersebut dan jadikan sebagai item baru
	 * dengan nama newName yang baru di bawah folder dengan folderId tersebut.
	 * Proses copy tidak melakukan copy terhadap isi editing yang sedang ada untuk
	 * item tersebut.
	 * 
	 * @param fileId   item id yang akan di copy content-nya
	 * @param folderId folder id tempat item baru akan dibuat
	 * @param newName  nama item baru yang akan dibuat
	 * @return id file hasil copy
	 * @throws RepositoryException jika terjadi masalah saat copy
	 */
	public UUID copyFile(UUID fileId, UUID folderId, String newName) throws RepositoryException;

	/**
	 * Ganti nama item menjadi nama baru sesuai newName yang diberikan.
	 * 
	 * @param itemId  item yang di ganti nama-nya
	 * @param newName nama baru
	 * @return true jika berhasil atau false jika sebaliknya
	 */
	public boolean renameItem(UUID itemId, String newName);

	/**
	 * Hapus item dengan itemId tersebut
	 * 
	 * @param itemId id item ayng akan di delete
	 * @return true jika berhasil atau false jika sebaliknya.
	 */
	public boolean deleteFile(UUID itemId);

	/**
	 * Simpan content untuk file dengan fileId tersebut.
	 * 
	 * @param fileId  fileId untuk yang file yang akan di simpan isi-nya.
	 * @param content isi yang akan di simpan
	 * @return true jika berhasil atau false jika sebaliknya
	 * @throws RepositoryException jika terjadi masalah saat menyimpan content
	 */
	public boolean saveContent(UUID fileId, String content) throws RepositoryException;

	/**
	 * Load content dari sebuah file dengan fileId tersebut.
	 * 
	 * @param fileId fileId dari file yang akan di load
	 * @return isi file dalam bentuk string
	 * @throws RepositoryException jika terjadi masalah saat membaca content
	 */
	public String loadContent(UUID fileId) throws RepositoryException;

	/**
	 * Jaga editing untuk file dengan fileId tersebut, last editing juga di update.
	 * 
	 * @param fileId  fileId dari file yang akan di jaga editing-nya.
	 * @param editing isi yang sedang di edit
	 * @return true jika proses menjaga editing berhasil di lakukan atau false jika
	 *         sebaliknya
	 * @throws RepositoryException jika terjadi masalah saat menyimpan editing
	 */
	public boolean keepEditing(UUID fileId, String editing) throws RepositoryException;

	/**
	 * Baca editing untuk file dengan fileId tersebut.
	 * 
	 * @param fileId file id yang akan dibaca isi editing-nya
	 * @return editing yang sedang ada untuk file tersebut atau null jika tidak ada
	 * @throws RepositoryException jika terjadi masalah saat membaca editing
	 */
	public String readEditing(UUID fileId) throws RepositoryException;

	/**
	 * Hapus editing dari file degan fileId tersebut sehingga editing menjadi null
	 * saat di baca.
	 * 
	 * @param fileId file yang akan di hapus editing-nya
	 * @return true jika proses penghapusan editing berhasil atau false jika
	 *         sebaliknya.
	 * @throws RepositoryException jika terjadi masalah saat membersihkan editing
	 */
	public boolean discardEditing(UUID fileId) throws RepositoryException;

	/**
	 * Jadikan content menjadi editing sehingga last editing menjadi sama dengan
	 * last modified.
	 * 
	 * @param fileId file yang akan di load editing dari content
	 * @return true jika berhasil atau false jika sebaliknya.
	 */
	public boolean placeEditing(UUID fileId);

	/**
	 * Simpan editing menjadi content dan editing tetap seperti semula.
	 * 
	 * @param fileId file yang akan di save editing ke content
	 * @return true jika berhasil atau jika sebaliknya
	 */
	public boolean flushEditing(UUID fileId);

}
