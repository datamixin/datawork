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
class MethodUtils:

	def checkField(prefix: str, methodName:  str) -> str:
		if methodName.startswith(prefix) and len(methodName) > len(prefix):
			index: int = len(prefix)
			ch = methodName[index]
			if ch.isupper():
				return ch.lower() + methodName[index + 1:]
		return None

	def checkGetOrIsField(methodName: str) -> str:
		fieldName: str = MethodUtils.checkField("get", methodName)
		if fieldName == None:
			fieldName = MethodUtils.checkField("is", methodName)
		return fieldName

	def checkSetField(methodName: str) -> str:
		return MethodUtils.checkField("set", methodName)

	def isExistsSetField(methodName: str, fieldName: str) -> bool:
		checkSet: str = MethodUtils.checkSetField(methodName)
		if checkSet is not None:
			return checkSet == fieldName
		else:
			return False
