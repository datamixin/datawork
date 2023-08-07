/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import * as tutorials from "bekasi/ui/tutorials";

import TaskKey from "bekasi/ui/TaskKey";
import TaskItem from "bekasi/ui/TaskItem";
import HomeMenu from "bekasi/ui/HomeMenu";
import TaskContent from "bekasi/ui/TaskContent";
import TaskManager from "bekasi/ui/TaskManager";
import BaseTaskItem from "bekasi/ui/BaseTaskItem";
import ConsoleTaskItem from "bekasi/ui/ConsoleTaskItem";
import TaskItemFactory from "bekasi/ui/TaskItemFactory";
import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";
import TaskContentViewer from "bekasi/ui/TaskContentViewer";
import TaskContentFactory from "bekasi/ui/TaskContentFactory";

import WorkspaceSite from "bekasi/ui/WorkspaceSite";
import WorkspacePanel from "bekasi/ui/WorkspacePanel";
import WorkspaceShell from "bekasi/ui/WorkspaceShell";
import WorkspaceConsole from "bekasi/ui/WorkspaceConsole";
import WorkspaceFullDeck from "bekasi/ui/WorkspaceFullDeck";
import WorkspaceTaskManager from "bekasi/ui/WorkspaceTaskManager";
import WorkspaceTaskItemPanel from "bekasi/ui/WorkspaceTaskItemPanel";
import WorkspaceConsoleMenuBar from "bekasi/ui/WorkspaceConsoleMenuBar";
import WorkspaceConsoleMenuPanel from "bekasi/ui/WorkspaceConsoleMenuPanel";

import AdvertiserPart from "bekasi/ui/AdvertiserPart";
import AdvertiserPanel from "bekasi/ui/AdvertiserPanel";
import AdvertiserAgent from "bekasi/ui/AdvertiserAgent";
import AdvertiserRoster from "bekasi/ui/AdvertiserRoster";
import AdvertiserPromoter from "bekasi/ui/AdvertiserPromoter";

import LoginProcess from "bekasi/ui/LoginProcess";
import SecurityProvider from "bekasi/ui/SecurityProvider";
import DefaultSecurityProvider from "bekasi/ui/DefaultSecurityProvider";
import SecurityProviderRegistry from "bekasi/ui/SecurityProviderRegistry";

import ConsolePage from "bekasi/ui/ConsolePage";
import HomeConsolePage from "bekasi/ui/HomeConsolePage";
import RecentConsolePage from "bekasi/ui/RecentConsolePage";
import ConsolePageFactory from "bekasi/ui/ConsolePageFactory";
import FavoriteConsolePage from "bekasi/ui/FavoriteConsolePage";
import ConsolePageSelector from "bekasi/ui/ConsolePageSelector";

import BaseComposer from "bekasi/ui/BaseComposer";
import TutorialMenu from "bekasi/ui/TutorialMenu";

export {

	tutorials,

	TaskKey,
	TaskItem,
	HomeMenu,
	TaskManager,
	TaskContent,
	BaseTaskItem,
	ConsoleTaskItem,
	TaskItemFactory,
	HomeMenuFactory,
	TaskContentViewer,
	TaskContentFactory,
	ConsolePageFactory,

	WorkspaceSite,
	WorkspacePanel,
	WorkspaceShell,
	WorkspaceConsole,
	WorkspaceFullDeck,
	WorkspaceTaskManager,
	WorkspaceTaskItemPanel,
	WorkspaceConsoleMenuBar,
	WorkspaceConsoleMenuPanel,

	AdvertiserPart,
	AdvertiserPanel,
	AdvertiserAgent,
	AdvertiserRoster,
	AdvertiserPromoter,

	LoginProcess,
	SecurityProvider,
	DefaultSecurityProvider,
	SecurityProviderRegistry,

	ConsolePage,
	HomeConsolePage,
	RecentConsolePage,
	FavoriteConsolePage,
	ConsolePageSelector,

	BaseComposer,
	TutorialMenu,

}
