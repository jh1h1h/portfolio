## Web

OWASP Top 10:

<details>
A01:2025 - Broken Access Control
A02:2025 - Security Misconfiguration
A03:2025 - Software Supply Chain Failures
A04:2025 - Cryptographic Failures
A05:2025 - Injection
A06:2025 - Insecure Design
A07:2025 - Authentication Failures
A08:2025 - Software or Data Integrity Failures
A09:2025 - Security Logging and Alerting Failures
A10:2025 - Mishandling of Exceptional Conditions
</details>

CSRF: Browsers automatically attach your cookies, so u can make a victim do a malicious action in vulnerable site like transfer you money or change their password if they have no CSRF protection. Requires user interaction! (to click on ur link) To defend against it you can use CSRF tokens that is random (cannot be predicted by the attacker) and has timeout, or you can use SameSite: Strict but this might break cross-site functionality if it is required. [more details](/docs/general/CSRF.md)

CORS vs CSRF: CORS is a policy that governs which external websites can <b>read</b> your site's data and CSRF is a vulnerability that allows attackers to issue malicious <b>write</b> requests on your behalf.

SSRF: Use internal redirects (ie if user can specify the url for a photo) and use localhost, 127.0.0.1, or other internal IP addresses and ports to access unauthorised tools

## Blue Team

DLP: Data Loss Prevention

IAM: Privileges for each user

ARP (address resolution protocol) table: maps from ip address to MAC address

EDR: Endpoint Detection and Response

TCB (Trusted Computing Base): OS (kernel), hardware, firmware (BIOS/UEFI), and other security-critical software. If a component inside the TCB is compromised, the security of the entire system is jeopardized.

Endpoint: devices like employee laptops and phones and sometimes servers. Network gear like switches and firewalls are not endpoints.