#
# Copyright (c) 2020-2023 Datamixin.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.#
from typing import List

# Luxor format
luxons: List[(str)] = []

# Year
luxons.append(("y", "%y", "y"))
luxons.append(("yy", "%y", "y"))
luxons.append(("yyyy", "%Y", "y"))

# Year
luxons.append(("q", "%q", "q"))
luxons.append(("qq", "%q", "q"))

# Month
luxons.append(("M", "%m", "M"))
luxons.append(("MM", "%m", "M"))
luxons.append(("MMM", "%b", "M"))
luxons.append(("MMMM", "%B", "M"))

# Day
luxons.append(("d", "%d", "d"))
luxons.append(("dd", "%d", "d"))
luxons.append(("w", "%w", "d"))
luxons.append(("c", "%u", "d"))
luxons.append(("ccc", "%a", "d"))
luxons.append(("cccc", "%A", "d"))
luxons.append(("ooo", "%j", "d"))

# Week
luxons.append(("W", "%W", "W"))
luxons.append(("WW", "%W", "W"))

# AMPM
luxons.append(("a", "%p", "a"))

# 12 Hour
luxons.append(("h", "%I", "h"))
luxons.append(("hh", "%I", "h"))

# 24 Hour
luxons.append(("H", "%H", "H"))
luxons.append(("HH", "%H", "H"))

# Minute
luxons.append(("m", "%M", "m"))
luxons.append(("mm", "%M", "m"))

# Second
luxons.append(("s", "%S", "s"))
luxons.append(("ss", "%S", "s"))


def getFromLuxon(input: str) -> str:
    lastGroup = ""
    for pair in reversed(luxons):
        key = pair[0]
        value = pair[1]
        group = pair[2]
        index = input.find(key)
        if index >= 0 and group != lastGroup:
            input = input.replace(key, value)
            lastGroup = group
    return removeSingleQuote(input)


def removeSingleQuote(input: str) -> str:
    counter = 0
    output = ""
    buffer = ""
    for char in input:
        if char == "'":
            counter = counter + 1
        if counter == 0:
            output = output + char
        elif counter == 2:
            counter = 0
            output = output + buffer[1:]
            buffer = ""
        else:
            buffer = buffer + char
    if counter == 1:
        output = output + "'" + buffer
    return output


def getGroups(input: str) -> str:
    groups: str = ""
    for pair in reversed(luxons):
        key = pair[0]
        group = pair[2]
        index = input.find(key)
        if index >= 0 and groups.find(group) == -1:
            groups = group + groups
    return groups
