#!/usr/bin/awk -f
BEGIN {
    FS="; ";
    out="["
}

!/^($|#)/ {
    split($1, points, "\\.\\.");
    start=strtonum("0x" points[1]);
    end=strtonum("0x" points[2]);

    out=out sprintf("{\"name\":\"%s\",\"start\":\"%d\",\"end\":\"%d\"},", $2, start, end);
}

END {
    print substr(out, 0, length(out) - 1) "]";
}
