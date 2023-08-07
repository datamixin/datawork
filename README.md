<!--
Copyright (c) 2020-2023 Datamixin.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
-->
<p align="center">
  
  <h1 align="center">Datamixin</h2>

  <p align="center">
    Your Predictive Apps With Low Code Platform
    <br />
    <br />
    Use low code cloud platform to transforms your valuable dataset into predictive model that guide your decision.
    <br />    
    <br />
    <a href="https://www.datamixin.com">Website</a>
    ·  
    <a href="https://www.datamixin.com/docs">Docs</a>  
  </p>
</p>

## 🔔 Stay up to date
Datamixin launched its v1.0.0 on Agustus 1st, 2023. Lots of new features are coming, and are generally released on a bi-weekly basis. Watch updates of this repository to be notified of future updates.


## 🔖 License
Distributed under the GPLv3 License. Read more [here](https://www.gnu.org/licenses/gpl-3.0.html).

## 💻 Deploy locally

### Requirements
1. Install Docker on your machine;
2. Make sure Docker Compose is installed and available (it should be the case if you have chosen to install Docker via Docker Desktop); and
3. Make sure Git is installed on your machine.

### Run the app

To start using Datamixin, run the following commands in a shell:

```
mkdir datamixin
cd datamixin
curl https://raw.githubusercontent.com/datamixin/datamixin/master/docker-compose.yml >> docker-compose.yml && docker compose up -d --remove-orphans
```
