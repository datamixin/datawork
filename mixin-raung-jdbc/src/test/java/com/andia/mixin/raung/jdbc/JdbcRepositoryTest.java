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
package com.andia.mixin.raung.jdbc;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.UUID;

import javax.sql.DataSource;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.raung.RepositoryException;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.raung.RepositoryItemList;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class JdbcRepositoryTest {

	private static JdbcRepository repository;
	private static String rootFolderName = "ROOT-FOLDER";
	private static String rootFileName = "ROOT-FILE";
	private static String copyFileName = "COPY-FILE";
	private static String regularFolderName = "REGULAR-FOLDER";
	private static String regularFileName = "REGULAR-FILE";
	private static String renameFileName = "REGULAR-RENAME-FILE";
	private static String content = "CONTENT";
	private static String editing = "EDITING";

	@BeforeAll
	public static void beforeAll() throws SQLException {
		MockJdbcDatabase database = new MockJdbcDatabase(JdbcRepositoryTest.class);
		DataSource dataSource = database.getDataSource();
		repository = new JdbcRepository();
		repository.setDataSource(dataSource);
	}

	@Test
	@Order(00)
	public void testFailInit() {
		assertThrows(IllegalArgumentException.class, () -> {
			JdbcRepository repository = new JdbcRepository();
			repository.setDataSource(null);
		});
	}

	@Test
	@Order(10)
	public void testCreateRootFolder() {
		UUID uuid = repository.createRootFolder(rootFolderName);
		assertNotNull(uuid);
	}

	@Test
	@Order(20)
	public void testCreateRootFile() {
		assertDoesNotThrow(() -> repository.createRootFile(rootFileName));
	}

	@Test
	@Order(30)
	public void testLoadRootItemList() {
		RepositoryItemList list = repository.loadRootItemList();
		assertItemNames(list, rootFileName, rootFolderName);
	}

	@Test
	@Order(40)
	public void testLoadRootItem() {
		assertNotNull(repository.loadRootItem(rootFileName));

	}

	@Test
	@Order(50)
	public void testIsRootItemExists() {
		assertTrue(repository.isRootItemExists(rootFolderName));
		assertTrue(repository.isRootItemExists(rootFileName));
	}

	private UUID loadRootFolderId() {
		RepositoryItem item = repository.loadRootItem(rootFolderName);
		UUID folderId = item.getId();
		return folderId;
	}

	@Test
	@Order(60)
	public void testCreateRegularFolder() {
		UUID rootFolderId = loadRootFolderId();
		UUID id = repository.createFolder(rootFolderId, regularFolderName);
		assertNotNull(id);
	}

	@Test
	@Order(70)
	public void testCreateRegularFile() {
		UUID rootFolderId = loadRootFolderId();
		UUID id = repository.createFile(rootFolderId, regularFileName);
		assertNotNull(id);
	}

	@Test
	@Order(80)
	public void testIsItemExistsByItemId() {
		UUID rootFolderId = loadRootFolderId();
		assertTrue(repository.isItemExists(rootFolderId));
	}

	@Test
	@Order(90)
	public void testIsItemExistsByFolderItemName() {
		UUID rootFolderId = loadRootFolderId();
		assertTrue(repository.isItemExists(rootFolderId, regularFileName));
	}

	@Test
	@Order(100)
	public void testLoadItemList() {
		UUID rootFolderId = loadRootFolderId();
		assertFolderItemNames(rootFolderId, regularFileName, regularFolderName);
	}

	private void assertFolderItemNames(UUID folderId, String... array) {
		RepositoryItemList list = repository.loadItemList(folderId);
		assertItemNames(list, array);
	}

	private void assertItemNames(RepositoryItemList list, String... array) {
		String[] names = list.getItemNames();
		assertEquals(array.length, names.length);
		Arrays.sort(array);
		Arrays.sort(names);
		assertArrayEquals(array, names);
	}

	@Test
	@Order(110)
	public void testMoveItem() {

		RepositoryItem item = repository.loadRootItem(rootFileName);
		UUID rootFileId = item.getId();

		UUID rootFolderId = loadRootFolderId();
		repository.moveItem(rootFileId, rootFolderId);

		assertFolderItemNames(rootFolderId, regularFileName, regularFolderName, rootFileName);

	}

	@Test
	@Order(120)
	public void testCopyFile() throws RepositoryException {

		UUID rootFolderId = loadRootFolderId();
		RepositoryItem item = repository.loadItem(rootFolderId, rootFileName);
		UUID rootFileId = item.getId();

		UUID id = repository.copyFile(rootFileId, rootFolderId, copyFileName);
		assertNotNull(id);

		assertFolderItemNames(rootFolderId, regularFileName, regularFolderName, rootFileName, copyFileName);

	}

	@Test
	@Order(130)
	public void testRenameItem() {

		UUID rootFolderId = loadRootFolderId();
		RepositoryItem item = repository.loadItem(rootFolderId, rootFileName);
		UUID fileId = item.getId();

		boolean rename = repository.renameItem(fileId, renameFileName);
		assertTrue(rename);

		assertFolderItemNames(rootFolderId, regularFileName, regularFolderName, renameFileName, copyFileName);

	}

	@Test
	@Order(140)
	public void testDeleteItem() {

		UUID rootFolderId = loadRootFolderId();
		RepositoryItem item = repository.loadItem(rootFolderId, renameFileName);
		UUID fileId = item.getId();

		boolean delete = repository.deleteFile(fileId);
		assertTrue(delete);

		assertFolderItemNames(rootFolderId, regularFileName, regularFolderName, copyFileName);

	}

	private UUID loadRegularFileId() {
		UUID rootFolderId = loadRootFolderId();
		RepositoryItem file = repository.loadItem(rootFolderId, regularFileName);
		UUID fileId = file.getId();
		return fileId;
	}

	@Test
	@Order(150)
	public void testSaveContent() throws RepositoryException {
		UUID fileId = loadRegularFileId();
		assertTrue(repository.saveContent(fileId, content));
	}

	@Test
	@Order(160)
	public void testLoadContent() throws RepositoryException {
		UUID fileId = loadRegularFileId();
		String loadContent = repository.loadContent(fileId);
		assertEquals(content, loadContent);
	}

	@Test
	@Order(170)
	public void testKeepEditing() throws RepositoryException {
		UUID fileId = loadRegularFileId();
		assertTrue(repository.keepEditing(fileId, editing));
	}

	@Test
	@Order(180)
	public void testReadEditing() throws RepositoryException {
		UUID fileId = loadRegularFileId();
		String readEditing = repository.readEditing(fileId);
		assertEquals(editing, readEditing);
	}

	@Test
	@Order(190)
	public void testLoadEditing() throws RepositoryException {
		UUID fileId = loadRegularFileId();
		assertTrue(repository.saveContent(fileId, content));
		assertTrue(repository.placeEditing(fileId));
		String content = repository.loadContent(fileId);
		String editing = repository.readEditing(fileId);
		assertEquals(content, editing);
		RepositoryItem item = repository.loadItem(fileId);
		assertEquals(item.getLastModified(), item.getLastEditing());
	}

	@Test
	@Order(200)
	public void testSaveEditing() throws RepositoryException {
		UUID fileId = loadRegularFileId();
		assertTrue(repository.keepEditing(fileId, editing));
		assertTrue(repository.flushEditing(fileId));
		String content = repository.loadContent(fileId);
		String editing = repository.readEditing(fileId);
		assertEquals(content, editing);
		RepositoryItem item = repository.loadItem(fileId);
		assertEquals(item.getLastModified(), item.getLastEditing());
	}

	@Test
	@Order(210)
	public void testDiscardaveEditing() throws RepositoryException {
		UUID fileId = loadRegularFileId();
		assertTrue(repository.discardEditing(fileId));
		assertNull(repository.readEditing(fileId));
	}
}
