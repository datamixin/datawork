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
import psycopg2
import pandas as pd
from typing import List
from garut.connectors.connector import Connector, ConnectorRegistry


class PostgreSQLConnector(Connector):

    CONNECTOR_NAME = "PostgreSQL"

    USERNAME = "username"
    PASSWORD = "password"

    RESULT_NAMES = []

    def getName(self) -> str:
        return PostgreSQLConnector.CONNECTOR_NAME

    def query(self, query: str) -> pd.DataFrame:
        username = self._credential.get(PostgreSQLConnector.USERNAME)
        password = self._credential.get(PostgreSQLConnector.PASSWORD)
        with psycopg2.connect(
            database=self._database,
            user=username,
            password=password,
            host=self._server,
            port=5432,
        ) as connection:
            return pd.read_sql_query(query, connection)

    def tables(self) -> List[str]:
        query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        result = self.query(query)
        return list(result["table_name"])


registry: ConnectorRegistry = ConnectorRegistry.getInstance()
registry.register(PostgreSQLConnector.CONNECTOR_NAME, PostgreSQLConnector)
