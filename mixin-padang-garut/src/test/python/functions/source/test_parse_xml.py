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
import unittest
import pandas as pd
from lxml import etree
from unittest import TestCase
from pandas.io.xml import read_xml
from lxml.etree import _ElementTree

from garut.functions.source.parse_xml import ElementMap, ParseXml


class TestParseXml(TestCase):
    XML = """<MOTree>
        <MO className="CGPOMUNE" fdn="NE=302">
            <MO className="CGPOMUIPADDR" fdn="NE=302,IPADDR=10.16.111.66_3_0_85">
                <attr name="IDX">0</attr>
                <attr name="MOIndex">47_10.16.111.66_3_0_85</attr>
                <attr name="name">IP index=0, MEID=85, Module=3,IP=10.16.111.66</attr>
                <attr name="neID">47</attr>
            </MO>
            <MO className="CGPOMUIPADDR" fdn="NE=302,IPADDR=10.16.111.98_3_1_85">
                <attr name="IDX">1</attr>
                <attr name="MOIndex">47_10.16.111.98_3_1_85</attr>
                <attr name="name">IP index=1, MEID=85, Module=3,IP=10.16.111.98</attr>
                <attr name="neID">47</attr>
            </MO>
        </MO>
    </MOTree>
    """
    XPATH = ".//MO[@className='CGPOMUIPADDR']"

    def testElementMap(self):
        tree: _ElementTree = etree.fromstring(TestParseXml.XML)
        result = tree.xpath(TestParseXml.XPATH)
        self.assertEqual(2, len(result))

        node = {**ElementMap(result[0])}
        self.assertEqual(3, len(node))
        self.assertEqual("CGPOMUIPADDR", node["className"])
        self.assertEqual("NE=302,IPADDR=10.16.111.66_3_0_85", node["fdn"])
        self.assertTrue(isinstance(node["attr"], list))
        self.assertEqual(4, len(node["attr"]))
        self.assertEqual(2, len(node["attr"][0]))
        self.assertEqual("IDX", node["attr"][0]["name"])
        self.assertEqual("0", node["attr"][0]["text"])

        data = read_xml(TestParseXml.XML, TestParseXml.XPATH)
        self.assertTrue(2, len(data))

    def testParseXml(self):
        parse = ParseXml()
        result: pd.DataFrame = parse.execute(
            None, {ParseXml.SOURCE: TestParseXml.XML, ParseXml.XPATH: TestParseXml.XPATH}
        )
        self.assertEqual(2, len(result))
        self.assertEqual(3, len(result.columns))
        self.assertEqual("className", result.columns[0])
        self.assertEqual("CGPOMUIPADDR", result.iloc[0, 0])
        self.assertEqual("CGPOMUIPADDR", result.iloc[1, 0])

        self.assertEqual("fdn", result.columns[1])
        self.assertEqual("NE=302,IPADDR=10.16.111.66_3_0_85", result.iloc[0, 1])
        self.assertEqual("NE=302,IPADDR=10.16.111.98_3_1_85", result.iloc[1, 1])

        self.assertEqual("attr", result.columns[2])
        self.assertTrue(isinstance(result.iloc[0, 2], list))
        self.assertEqual(4, len(result.iloc[0, 2]))

        self.assertTrue(isinstance(result.iloc[0, 2][0], dict))
        self.assertTrue("name" in result.iloc[0, 2][0])
        self.assertTrue("IDX", result.iloc[0, 2][0]["name"])
        self.assertTrue("text" in result.iloc[0, 2][0])
        self.assertTrue("0", result.iloc[0, 2][0]["text"])

        self.assertTrue(isinstance(result.iloc[0, 2][1], dict))
        self.assertTrue(isinstance(result.iloc[0, 2][2], dict))
        self.assertTrue(isinstance(result.iloc[0, 2][3], dict))

        self.assertTrue(isinstance(result.iloc[1, 2], list))
        self.assertEqual(4, len(result.iloc[1, 2]))
        self.assertTrue(isinstance(result.iloc[1, 2][0], dict))
        self.assertTrue(isinstance(result.iloc[1, 2][1], dict))
        self.assertTrue(isinstance(result.iloc[1, 2][2], dict))
        self.assertTrue(isinstance(result.iloc[1, 2][3], dict))


if __name__ == "__main__":
    unittest.main()
