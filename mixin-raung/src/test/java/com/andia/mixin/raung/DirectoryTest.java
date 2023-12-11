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
package com.andia.mixin.raung;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collection;
import java.util.UUID;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InOrder;
import org.mockito.Mockito;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DirectoryTest {

	private static Repository repository = Mockito.mock(Repository.class);
	private static UUID folderId = UUID.randomUUID();
	private static UUID fileId = UUID.randomUUID();
	private static UUID newFileId = UUID.randomUUID();
	private static UUID deleteFileId = UUID.randomUUID();
	private static UUID renameFileId = UUID.randomUUID();
	private static String filename = "filename";
	private static String newFilename = "newFilename";
	private static String deleteFilename = "deleteFilename";
	private static String oldNameFilename = "oldNameFilename";
	private static String newNameFilename = "newNameFilename";
	private static String text = "text";
	private static String extension = "ext";
	private static Directory directory = new Directory(repository, folderId, extension);

	private static RepositoryItem mockItem(UUID itemId, String filename) {
		RepositoryItem item = Mockito.mock(RepositoryItem.class);
		String fullname = directory.getFullName(filename);
		Mockito.when(item.getId()).thenReturn(itemId);
		Mockito.when(item.getName()).thenReturn(fullname);
		Mockito.when(item.isFile()).thenReturn(true);
		Mockito.when(item.getLastModified()).thenReturn(1L);
		return item;
	}

	@Test
	@Order(000)
	public void testGetFullname() {
		String fullname = directory.getFullName(filename);
		assertEquals(fullname, filename + "." + extension);
	}

	@Test
	@Order(010)
	public void testGetFileContents() throws RepositoryException {

		// Mock
		String fullname = directory.getFullName(filename);
		RepositoryItem item = mockItem(fileId, filename);
		Mockito.when(repository.loadItem(folderId, fullname)).thenReturn(item);
		Mockito.when(repository.loadContent(fileId)).thenReturn(text);

		// Assert
		String contents = directory.getFileContents(filename);
		assertEquals(contents, text);
	}

	@Test
	@Order(020)
	public void testSetFileContents() throws RepositoryException {

		// Assert
		directory.setFileContents(filename, text);
		InOrder order = Mockito.inOrder(repository);
		order.verify(repository, Mockito.calls(1)).saveContent(fileId, text);
	}

	@Test
	@Order(030)
	public void testCreateNewFile() throws RepositoryException {

		// Mock
		String newFullname = directory.getFullName(newFilename);
		mockItem(newFileId, newFilename);
		Mockito.when(repository.createFile(folderId, newFullname)).thenReturn(newFileId);

		// Assert
		assertTrue(directory.createNewFile(newFilename));
	}

	@Test
	@Order(040)
	public void testDelete() throws RepositoryException {

		// Mock
		String deleteFullname = directory.getFullName(deleteFilename);
		RepositoryItem deleteItem = mockItem(deleteFileId, deleteFilename);
		Mockito.when(repository.loadItem(folderId, deleteFullname)).thenReturn(deleteItem);
		Mockito.when(repository.deleteFile(deleteFileId)).thenReturn(true);

		// Assert
		assertTrue(directory.delete(deleteFilename));
	}

	@Test
	@Order(050)
	public void testRename() throws RepositoryException {

		// Mock
		RepositoryItem renameItem = mockItem(renameFileId, oldNameFilename);
		String oldNameFullname = directory.getFullName(oldNameFilename);
		String newNameFullname = directory.getFullName(newNameFilename);
		Mockito.when(repository.loadItem(folderId, oldNameFullname)).thenReturn(renameItem);
		Mockito.when(repository.renameItem(renameFileId, newNameFullname)).thenReturn(true);

		// Assert
		assertTrue(directory.rename(oldNameFilename, newNameFilename));
	}

	@Test
	@Order(060)
	public void testIsExists() {

		// Mock
		String fullname = directory.getFullName(filename);
		Mockito.when(repository.isItemExists(folderId, fullname)).thenReturn(true);

		// Assert
		assertTrue(directory.isExists(filename));
	}

	@Test
	@Order(070)
	public void testGetModified() {
		assertEquals(directory.getModified(filename), 1L);
	}

	@Test
	@Order(070)
	public void testListNames() {

		// Mock
		RepositoryItemList items = Mockito.mock(RepositoryItemList.class);
		RepositoryItem[] list = new RepositoryItem[] {
				mockItem(fileId, filename),
				mockItem(newFileId, newFilename)
		};
		Mockito.when(items.getItems()).thenReturn(list);
		Mockito.when(repository.loadItemList(folderId)).thenReturn(items);

		// Assert
		Collection<String> names = directory.listNames();
		assertEquals(2, names.size());
		assertTrue(names.contains(filename));
		assertTrue(names.contains(newFilename));
	}

}
