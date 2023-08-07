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
package com.andia.mixin.bekasi.quarkus;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Base64.Decoder;

import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.build.JwtClaimsBuilder;
import io.smallrye.jwt.build.JwtSignatureBuilder;

public class TokenUtils {

	// Must match mp.jwt.verify.issuer in application.properties
	private static final String ISSUES = "https://www.andiasoft.com/mixin";

	private TokenUtils() {
	}

	public static String generateToken(String subject) throws IOException {

		JwtClaimsBuilder claims = Jwt.claims();

		// Subject
		claims.subject(subject);

		claims.issuer(ISSUES);

		// Issues at current time
		long currentTimeMillis = currentTimeInSecs();
		claims.issuedAt(currentTimeMillis);

		// Expiration in 30 minutes
		long expirationTime = currentTimeMillis + 1000 * 60 * 30;
		claims.expiresAt(expirationTime);

		// Sign with HS256
		try {
			String kid = "/privateKey.pem";
			PrivateKey privateKey = readPrivateKey(kid);
			JwtSignatureBuilder jws = claims.jws();
			jws.keyId(kid);
			String token = jws.sign(privateKey);
			return token;

		} catch (Exception e) {
			throw new IOException("Fail generate token", e);
		}
	}

	/**
	 * Read a PEM encoded private key from the classpath
	 *
	 * @param pemResName - key file resource name
	 * @return PrivateKey
	 * @throws Exception on decode failure
	 */
	private static PrivateKey readPrivateKey(final String pemResName) throws Exception {
		InputStream contentIS = TokenUtils.class.getResourceAsStream(pemResName);
		byte[] tmp = new byte[4096];
		int length = contentIS.read(tmp);
		String privateKey = new String(tmp, 0, length, "UTF-8");
		return decodePrivateKey(privateKey);
	}

	/**
	 * Decode a PEM encoded private key string to an RSA PrivateKey
	 *
	 * @param pemEncoded - PEM string for private key
	 * @return PrivateKey
	 * @throws Exception on decode failure
	 */
	private static PrivateKey decodePrivateKey(final String pemEncoded) throws Exception {
		byte[] encodedBytes = toEncodedBytes(pemEncoded);
		PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encodedBytes);
		KeyFactory factory = KeyFactory.getInstance("RSA");
		return factory.generatePrivate(keySpec);
	}

	private static byte[] toEncodedBytes(final String pemEncoded) {
		final String normalizedPem = removeBeginEnd(pemEncoded);
		Decoder decoder = Base64.getDecoder();
		return decoder.decode(normalizedPem);
	}

	private static String removeBeginEnd(String pem) {
		pem = pem.replaceAll("-----BEGIN (.*)-----", "");
		pem = pem.replaceAll("-----END (.*)----", "");
		pem = pem.replaceAll("\r\n", "");
		pem = pem.replaceAll("\n", "");
		return pem.trim();
	}

	/**
	 * @return the current time in seconds since epoch
	 */
	public static int currentTimeInSecs() {
		long currentTimeMS = System.currentTimeMillis();
		return (int) (currentTimeMS / 1000);
	}
}
