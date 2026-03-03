### Loose comparison (==)

string == integer -> PHP takes first chaarcter of string and convert to integer
For PHP 7.x, random strings convert by default to 0 if not starting with a number

5 == "5xyz" evaluates to true
0 == "Example string" evaluates to true (Only for PHP 7.x)