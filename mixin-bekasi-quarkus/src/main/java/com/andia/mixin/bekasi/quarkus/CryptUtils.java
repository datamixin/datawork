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
package com.andia.mixin.bekasi.quarkus;

import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.andia.mixin.util.UUIDUtils;

public class CryptUtils {

	protected static final String ALGO = "AES"; // Default uses ECB PKCS5Padding

	protected static final String DESKTOP_DECRYPT_RESULT = "5f4fe2ca-5e4c-446e-aba8-bd8222007617";
	protected static final String DESKTOP_SECRET_KEY = "AvFsTQpfC3ADlQ9FLvqX7A==";

	public static String encrypt(String text, String base64SecretKey) throws Exception {
		Key key = generateKey(base64SecretKey);
		Cipher c = Cipher.getInstance(ALGO);
		c.init(Cipher.ENCRYPT_MODE, key);
		byte[] encVal = c.doFinal(text.getBytes());
		String encryptedValue = Base64.getEncoder().encodeToString(encVal);
		return encryptedValue;
	}

	public static String decrypt(String chipperText, String base64SecretKey) throws Exception {
		Key key = generateKey(base64SecretKey);
		Cipher cipher = Cipher.getInstance(ALGO);
		cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(Base64.getDecoder().decode(chipperText)));
	}

	private static Key generateKey(String secret) throws Exception {
		byte[] decoded = Base64.getDecoder().decode(secret.getBytes());
		Key key = new SecretKeySpec(decoded, ALGO);
		return key;
	}

	public static String generateRandomKey() throws Exception {
		SecureRandom random = SecureRandom.getInstanceStrong();
		KeyGenerator keyGen = KeyGenerator.getInstance(ALGO);
		keyGen.init(128, random);
		SecretKey key = keyGen.generateKey();

		byte[] encoded = key.getEncoded();
		byte[] encodedBase64 = Base64.getEncoder().encode(encoded);
		return new String(encodedBase64);
	}

	public static void main(String a[]) throws Exception {
		// System.out.println(CryptUtils.generateRandomKey());
		String encrypt = CryptUtils.encrypt(DESKTOP_DECRYPT_RESULT, DESKTOP_SECRET_KEY);
		System.out.println(encrypt);
		String decrypt = CryptUtils.decrypt(encrypt, DESKTOP_SECRET_KEY);
		System.out.println(decrypt);
		System.out.println(UUIDUtils.isUUID(decrypt));

	}
}
