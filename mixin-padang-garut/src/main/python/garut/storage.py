#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
import os
import pickle
import shutil
import shutil
import pandas as pd
from pathlib import Path


class Resource:
    def getNode(self) -> any:
        pass


class StorageFile(Resource):
    def getName(self) -> str:
        pass

    def prepareFolder(self, name: str):
        pass

    def isFolderExists(self, name: str):
        return False

    def openFolder(self, name: str) -> any:
        pass

    def copyTo(self, target: any):
        pass

    def saveDataFile(self, name: str, contents: any):
        pass

    def loadDataFile(self, name: str) -> any:
        pass

    def renameTo(self, name: str):
        pass

    def deleteFile(self, name: str):
        pass

    def isFile(self) -> bool:
        pass

    def isDataFile(self, name: str) -> bool:
        pass

    def deleteDataFile(self, name: str):
        pass

    def isFolder(self) -> bool:
        pass

    def delete(self):
        pass


class Storage(Resource):
    def prepareRootFolder(self, name: str):
        pass

    def isRootFolderExists(self, name: str) -> bool:
        return False

    def openRootFolder(self, name: str) -> StorageFile:
        pass


class LocalStorageFile(StorageFile):
    def __init__(self, parent: Resource, name: str):
        self._parent: Resource = parent
        self._name = name

    def getName(self) -> str:
        return self._name

    def getNode(self) -> Path:
        path = self._parent.getNode()
        return Path(path, self._name)

    def prepareFolder(self, name: str):
        path = self.getNode()
        folder = path.joinpath(name)
        if folder.exists() == False:
            os.mkdir(folder)

    def isFolderExists(self, name: str):
        path = self.getNode()
        folder = Path(path, name)
        return folder.exists()

    def openFolder(self, name: str):
        return LocalStorageFile(self, name)

    def copyTo(self, target: StorageFile):
        sourcePath: Path = self.getNode()
        targetPath: Path = target.getNode()
        if os.path.exists(targetPath):
            shutil.rmtree(targetPath)
        shutil.copytree(sourcePath, targetPath)

    def renameTo(self, name: str):
        oldPath = self.getNode()
        newPath = Path(oldPath.parent, name)
        if newPath.exists():
            shutil.rmtree(newPath)
        oldPath.rename(newPath)
        self._name = name

    def saveDataFile(self, name: str, data: any):
        if isinstance(data, pd.DataFrame):
            objects = data.select_dtypes(object)
            if len(objects) > 0:
                self._savePickleDataFile(name, data)
            else:
                file = self._getParquetFile(name)
                data.to_parquet(file)
        else:
            self._savePickleDataFile(name, data)

    def _savePickleDataFile(self, name: str, data: any):
        file = self._getPickleFile(name)
        datafile = open(file, "wb")
        pickle.dump(data, datafile)
        datafile.close()

    def _getParquetFile(self, name: str) -> Path:
        return self._getPath(name + ".parquet")

    def _getPickleFile(self, name: str) -> Path:
        return self._getPath(name + ".pickle")

    def loadDataFile(self, name: str) -> any:
        file = self._getParquetFile(name)
        if file.exists() == True:
            data = pd.read_parquet(file)
            return data
        else:
            file = self._getPickleFile(name)
            if file.exists() == True:
                datafile = open(file, "rb")
                try:
                    data = pickle.load(datafile)
                    datafile.close()
                except EOFError as e:
                    return e
                return data
            else:
                return None

    def isDataFile(self, name: str) -> bool:
        file = self._getParquetFile(name)
        if file.exists() == True:
            return True
        else:
            file = self._getPickleFile(name)
            return file.exists()

    def deleteDataFile(self, name: str) -> any:
        file = self._getParquetFile(name)
        if file.exists() == True:
            return os.remove(file)
        else:
            file = self._getPickleFile(name)
            if file.exists() == True:
                os.remove(file)

    def deleteFile(self, name: str):
        file = self._getPath(name)
        if file.exists() == True:
            os.remove(file)

    def _getPath(self, name: str) -> Path:
        path = self.getNode()
        return Path(path, name)

    def isFile(self) -> bool:
        path = self.getNode()
        return path.is_file()

    def isFolder(self) -> bool:
        path = self.getNode()
        return path.is_dir()

    def delete(self):
        path = self.getNode()
        if path.is_file():
            os.remove(path)
        else:
            shutil.rmtree(path)


class LocalStorage(Storage):
    def __init__(self, path: str):
        self._path: Path = Path(path)
        if self._path.exists() == False:
            os.makedirs(path)

    def getNode(self) -> Path:
        return self._path

    def prepareRootFolder(self, name: str):
        folder = self._path.joinpath(name)
        if folder.exists() == False:
            os.makedirs(folder)

    def isRootFolderExists(self, name: str):
        path = Path(self._path, name)
        return path.exists()

    def openRootFolder(self, name: str) -> StorageFile:
        return LocalStorageFile(self, name)
