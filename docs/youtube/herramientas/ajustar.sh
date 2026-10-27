#!/bin/bash
# Reduce un mp4 a ~330 MB (límite de envío 400 MiB) re-codificando con bitrate objetivo; sustituye el original.
f="$1"; tam=$(stat -c%s "$f"); [ $tam -lt 390000000 ] && { echo "ya cabe: $f"; exit 0; }
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
kb=$(python3 -c "print(int(330e6*8/$dur/1000)-200)")
nice -n 10 ffmpeg -y -loglevel error -i "$f" -c:v libx264 -preset medium -b:v ${kb}k -maxrate $((kb*3/2))k -bufsize $((kb*2))k -pix_fmt yuv420p -c:a copy -movflags +faststart "${f%.mp4}.tmp.mp4" && mv "${f%.mp4}.tmp.mp4" "$f"
ls -la "$f"
