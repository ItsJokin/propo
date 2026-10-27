import re
def rep(p,a,b):
    s=open(p).read(); assert a in s,(p,a[:60]); open(p,"w").write(s.replace(a,b,1))
def renum(p, desde):
    s=open(p).read()
    s=re.sub(r'\("(\d+)\. ', lambda m: f'("{int(m.group(1))+1}. ' if int(m.group(1))>=desde else m.group(0), s)
    s=re.sub(r'\("cap(\d+)", 0, -0\.6\)', lambda m: f'("cap{int(m.group(1))+1}", 0, -0.6)' if int(m.group(1))>=desde else m.group(0), s)
    open(p,"w").write(s)
def iconos(p, desde, nuevo):
    """Desplaza CAP_ICONOS >= desde y pone el icono nuevo en «desde»."""
    s=open(p).read(); i=s.index("CAP_ICONOS = {"); j=s.index("}", i)
    d=eval(s[i+13:j+1]); d2={ (k+1 if k>=desde else k): v for k,v in d.items()}; d2[desde]=nuevo
    s=s[:i]+"CAP_ICONOS = "+repr(dict(sorted(d2.items())))+s[j+1:]; open(p,"w").write(s)
