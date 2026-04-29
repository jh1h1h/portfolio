`codex` then just ask it to solve ur CTF challenge. Make sure the CTF challenge files are in the current directory or smth and tell it where the files are or what the endpoints are.

Has difficulty:
- some phantom port already being used and the challenge binary requires that port specifically
- reversing strings from binary files (take the binary file and put in a separate chat until it forms a kind of legible string and u verify that like it makes sense or if not ask the code to try what you think is the correct decoded payload)
- factoring big numbers for crypto challenges (it will try to bruteforce it or smth and use up a lot of tokens). maybe instruct it to use factordb instead, but i haven't tried it yet (i think pentestgpt asks it to use factordb and it does)