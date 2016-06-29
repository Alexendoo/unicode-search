#!/usr/bin/awk -f
BEGIN {
    FS=";";
    out="{"
}

$2 == "<control>" && $11 {
    out=out sprintf("\"%d\":\"%s\",", strtonum("0x" $1), $11);
    next;
}

{
    out=out sprintf("\"%d\":\"%s\",", strtonum("0x" $1), $2);
}

END {
    print substr(out, 0, length(out) - 1) "}";
}
