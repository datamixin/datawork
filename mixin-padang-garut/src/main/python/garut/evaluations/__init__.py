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
from . import null_evaluation
from . import text_evaluation
from . import number_evaluation
from . import logical_evaluation
from . import list_evaluation
from . import object_evaluation

from . import let_evaluation
from . import call_evaluation
from . import unary_evaluation
from . import binary_evaluation
from . import lambda_evaluation
from . import foreach_evaluation
from . import conditional_evaluation

from . import alias_evaluation
from . import member_evaluation
from . import reference_evaluation
