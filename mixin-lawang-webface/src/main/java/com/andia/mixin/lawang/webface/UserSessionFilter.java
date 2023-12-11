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
package com.andia.mixin.lawang.webface;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.DispatcherType;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.andia.mixin.lawang.SecuritySetting;

@WebFilter(dispatcherTypes = { DispatcherType.REQUEST }, servletNames = { "default" }, urlPatterns = { "/*" })
public class UserSessionFilter extends HttpFilter {

	private static final long serialVersionUID = 2516370764224152206L;

	private static final String FILTER_USER_ID = "filter.user.id";
	
	public static final String ROOT = "/";
	
	public final static String LANDING_PATH = "/workspace/index.html";

	private String filterUserId;

	public UserSessionFilter() {
		filterUserId = System.getProperty(FILTER_USER_ID);
	}

	@Inject
	public void setGenerator(SecuritySetting setting) {
		
		UserSessionSecuritySetting info = (UserSessionSecuritySetting) setting;
		info.setUserId(filterUserId);
	}

	@Override
	protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		
		String requestURI = request.getRequestURI();
		boolean isRootRequest = requestURI.equals(ROOT);

		if (isRootRequest) {
			
			response.sendRedirect(LANDING_PATH);
			
		} else {

			chain.doFilter(request, response);
		}
	}

}
