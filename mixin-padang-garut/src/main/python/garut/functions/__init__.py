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
import ssl
from . import math
from . import stat
from . import file
from . import text
from . import list
from . import plot
from . import model
from . import object
from . import source
from . import system
from . import logical
from . import encoder
from . import dataset
from . import feature
from . import datetime
from . import splitter
from . import aggregate

ssl._create_default_https_context = ssl._create_unverified_context
