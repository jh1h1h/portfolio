With reference to [Portswigger Academy's Topic on Insecure Deserialization](https://portswigger.net/web-security/deserialization)

## PHP
<details>
PHP serialized objects looks like this:

`O:4:"User":2:{s:4:"name":s:6:"carlos";s:10:"isLoggedIn":b:1;}`

- `O:4:"User"` - An object with the 4-character class name "User"
- `2` - the object has 2 attributes
- `s:4:"name"` - The key of the first attribute is the 4-character string "name"
- `s:6:"carlos"` - The value of the first attribute is the 6-character string "carlos"
- `s:10:"isLoggedIn"` - The key of the second attribute is the 10-character string "isLoggedIn"
- `b:1` - The value of the second attribute is the boolean value true

Look out for methods `serialize()` and `unserialize()` in source code if you have access.
</details>

## Java
<details>
Serialized objects in Java often begin with the same few bytes, which are encoded as `ac ed` in hexadecimal and `rO0` in Base64.

Look out for methods `readObject()` in source code if you have access.
</details>