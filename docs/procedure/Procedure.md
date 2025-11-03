---
sidebar_position: 1
---

### 1. Run begin.sh (basically autorecon)

<details>
While running, consider checking out HTTP ports. Document the general purpose of the site and any user flows. Do <a href="./general/Connecting">anonymous login</a> for any main services identified also.
</details>

### 2. After nmap full port scan is done

<details>
List down all ports and prioritise which to look thru first.
 
Add to to-do:
- <a href="./general/Connecting">anonymous login</a> for any known services
- investigate unknown ports 

Look thru full nmap scan for any definitive versions and add that to software/versions list.
</details>

### 3. After everything is done

<details>
- Check feroxbuster for HTTP ports
- Check patterns for any new identified software or CVEs
</details>

