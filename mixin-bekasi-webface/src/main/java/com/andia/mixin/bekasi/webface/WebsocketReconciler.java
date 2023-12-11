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
package com.andia.mixin.bekasi.webface;

import java.io.StringWriter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.RemoteEndpoint.Async;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Reconciler;
import com.andia.mixin.bekasi.reconciles.HeartbeatReconcile;
import com.andia.mixin.bekasi.reconciles.Reconcile;
import com.fasterxml.jackson.databind.ObjectMapper;

@ApplicationScoped
@ServerEndpoint(WebsocketReconciler.PATH)
public class WebsocketReconciler implements Reconciler {

	public static final String PATH = "/websocket/reconciler/{username}";

	private static Logger logger = LoggerFactory.getLogger(WebsocketReconciler.class);

	private Map<String, Session> sessions = new ConcurrentHashMap<>();

	private ObjectMapper mapper = new ObjectMapper();

	@OnOpen
	public void onOpen(Session session, @PathParam("username") String username) {
		session.setMaxIdleTimeout(3);
		sessions.put(username, session);
		logger.trace("Reconciler username " + username + " logged in");
	}

	@OnClose
	public void onClose(Session session, @PathParam("username") String username) {
		logger.trace("Reconciler close " + username);
		sessions.remove(username); // Once browser unloading or close
	}

	@OnError
	public void onError(Session session, @PathParam("username") String username, Throwable throwable) {
		logger.error("Reconciler username " + username + " has error ", throwable);
		sessions.remove(username);
	}

	@OnMessage
	public void onMessage(String message, @PathParam("username") String username) {
		if (sessions.containsKey(username)) {
			if (message.length() == 0) {
				sendHeartbeat(username);
			}
		}
	}

	private void sendHeartbeat(String username) {
		Reconcile reconcile = new HeartbeatReconcile();
		reconcile(username, reconcile);
	}

	@Override
	public void reconcile(String username, Reconcile reconcile) {

		String info = reconcile.info();
		if (sessions.containsKey(username)) {

			String text;
			try {
				StringWriter writer = new StringWriter();
				mapper.writeValue(writer, reconcile);
				text = writer.toString();
			} catch (Exception e) {
				String message = "Fail serialize reconcile " + info + " to json";
				logger.error(message, e);
				throw new WebsocketServerException(message, e);
			}

			Session session = sessions.get(username);
			Async remote = session.getAsyncRemote();
			remote.sendText(text, result -> {
				Throwable throwable = result.getException();
				if (throwable != null) {
					String message = "Reconciler fail send to username " + username;
					logger.error(message, throwable);
					throw new WebsocketServerException(message, throwable);
				} else {
					int length = text.length();
					String as = length + " characters json message";
					logger.error("Reconciler send to username " + username + " reconcile " + info + " as " + as);
				}
			});

		} else {
			logger.error("Missing session for username " + username + " while reconcile " + info);
		}
	}

}
