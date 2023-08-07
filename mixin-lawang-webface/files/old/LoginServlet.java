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
package com.andia.mixin.lawang.webface.old;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.HttpHeaders;

import com.andia.mixin.lawang.SecuritySetting;
import com.andia.mixin.lawang.UserDetails;
import com.andia.mixin.lawang.UserDetailsService;

@WebServlet(LoginServlet.PATH)
public class LoginServlet extends HttpServlet {

	public final static String PATH = "/lawang/login";

	private static final long serialVersionUID = 2080333001236749575L;

	private static final String USERNAME = "username";
	private static final String PASSWORD = "password";

	private SecuritySetting setting;
	private UserDetailsService service;
	private TokenGenerator generator;

	@Inject
	public void setService(UserDetailsService service) {
		this.service = service;
	}

	@Inject
	public void setSetting(SecuritySetting setting) {
		this.setting = setting;
	}

	@Inject
	public void setGenerator(TokenGenerator generator) {
		this.generator = generator;
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {

		// Check login using username and password
		String username = request.getParameter(USERNAME);
		String password = request.getParameter(PASSWORD);
		service.login(username, password);

		// Get user detail by username
		UserDetails details = service.loadByUsername(username);
		String token = generator.token(details);

		// Cari redirect cookies
		Cookie[] cookies = request.getCookies();
		String redirect = null;
		boolean hasRedirect = false;
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(AuthenticationFilter.REDIRECT)) {
					redirect = cookie.getValue();
					hasRedirect = true;
					break;
				}
			}
		}

		// Response dengan pemasangan authorization cookie http-only di secured path
		Cookie cookie = new Cookie(HttpHeaders.AUTHORIZATION, token);
		String path = setting.getSecuredPath();
		cookie.setPath(path);
		cookie.setHttpOnly(true);
		response.addCookie(cookie);

		if (hasRedirect && !redirect.equals(AuthenticationFilter.ROOT)) {

			// Redirect sesuai ke isi redirect jika bukan root
			response.sendRedirect(redirect);

		} else {

			// Default redirect ke landing page
			String page = setting.getLandingPage();
			response.sendRedirect(page);

		}

	}

}
