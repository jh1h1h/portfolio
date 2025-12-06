# RPC

Microsoft RPC (Remote Procedure Call) is a protocol that allows programs to execute code on remote systems as if they were local function calls. It is used by like printers or AD for various purposes, or also stuff like PsExec or wmic.

## rpcclient Commands

```bash
rpcclient -U=user $IP
rpcclient -U="" $IP #Anonymous login
##Commands within in RPCclient
srvinfo
enumdomusers #users
enumpriv #like "whoami /priv"
queryuser <user> #detailed user info
getuserdompwinfo <RID> #password policy, get user-RID from previous command
lookupnames <user> #SID of specified user
createdomuser <username> #Creating a user
deletedomuser <username>
enumdomains
enumdomgroups
querygroup <group-RID> #get rid from previous command
querydispinfo #description of all users
netshareenum #Share enumeration, this only comesup if the current user we're logged in has permissions
netshareenumall
lsaenumsid #SID of all users
```
Credit: [Sai Sathvik's OSCP Cheatsheet](https://github.com/saisathvik1/OSCP-Cheatsheet)