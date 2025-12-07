`mdb-sql <file>` → `list tables;` (or `list tables` then `go`) → `mdb-export <mdb file> <table name>`

to export all tables:

`mkdir tables` then `for i in $(mdb-tables <file>.mdb); do mdb-export <file>.mdb $i > tables/$i; done` . `wc -l * | sort -n` counts and sorts by no of lines, u can ignore the one line ones cus they r blank