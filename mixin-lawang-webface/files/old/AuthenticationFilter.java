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
//import javax.servlet.DispatcherType;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
//import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.HttpHeaders;

import com.andia.mixin.lawang.SecurityInterceptor;
import com.andia.mixin.lawang.SecuritySetting;
import com.andia.mixin.lawang.UserDetails;
import com.andia.mixin.lawang.UserDetailsService;

// @WebFilter(dispatcherTypes = { DispatcherType.REQUEST }, servletNames = { "default" }, urlPatterns = { "/*" })
public class AuthenticationFilter extends HttpFilter {

	// Root path application
	public static final String ROOT = "/";

	// Label untuk redirect
	public static final String REDIRECT = "redirect";

	// Public key tidak di protect
	private static final String PUBLIC_KEY_URI = "/publicKey.pem";

	private static final long serialVersionUID = 4624506876650876827L;

	private SecuritySetting setting;

	private SecurityInterceptor interceptor;

	private TokenGenerator generator;

	private UserDetailsService service;

	@Inject
	public void setGenerator(TokenGenerator generator) {
		this.generator = generator;
	}

	@Inject
	public void setService(UserDetailsService service) {
		this.service = service;
	}

	@Inject
	public void setInterceptor(SecurityInterceptor interceptor) {
		this.interceptor = interceptor;
	}

	@Inject
	public void setSetting(SecuritySetting configuration) {
		this.setting = configuration;
	}

	@Override
	protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		// Session tidak digunakan
		request.getSession(false);

		// Baca semua status
		String requestURI = request.getRequestURI();
		String samplesPath = setting.getSamplesPath();
		String landingPage = setting.getLandingPage();
		boolean isSamplesPath = requestURI.startsWith(samplesPath);
		boolean isRootRequest = requestURI.equals(ROOT);

		Cookie[] cookies = request.getCookies();

		// Verify interceptor
		if (interceptor.requireVerification()) {

			Cookie interceptorCookie = null;
			boolean bypassed = false;
			if (requestURI.equals(PUBLIC_KEY_URI) || isSamplesPath) {
				bypassed = true;
			}

			if (!bypassed) {

				if (cookies != null) {
					for (Cookie cookie : cookies) {
						String verificationKey = interceptor.getVerificationKey();
						if (cookie.getName().equals(verificationKey)) {
							interceptorCookie = cookie;
							break;
						}
					}
				}

				boolean verified = false;
				if (interceptorCookie != null) {
					String value = interceptorCookie.getValue();
					verified = interceptor.isVerified(value);
				}

				if (!verified) {
					response.sendError(HttpServletResponse.SC_FORBIDDEN);
					return;
				}
			}
		}

		// Apakah bearer ada di header
		UserDetails details = service.loadByUsername(SecuritySetting.BYPASS_USERNAME);
		String token = generator.token(details);

		Cookie cookie = new Cookie(HttpHeaders.AUTHORIZATION, token);
		String path = setting.getSecuredPath();
		cookie.setPath(path);
		cookie.setHttpOnly(true);
		response.addCookie(cookie);

		if (isRootRequest) {

			// Jika sudah login dan request ke root maka arahkan ke landing page
			response.sendRedirect(landingPage);

		} else {

			// User sudah login, lanjutkan chain
			chain.doFilter(request, response);
		}

	}

}
