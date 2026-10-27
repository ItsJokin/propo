import sys, re
p = sys.argv[1]; s = open(p).read()
s2 = re.sub(r'\n",\n', '",\n', s)
open(p, 'w').write(s2); print(s.count('\n",\n'), "saltos corregidos")
