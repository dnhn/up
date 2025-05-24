printf '{\n\t"at": "%s",\n\t"up": "%s"\n}' \
  "$(date -Iseconds)" \
  "$(uptime | awk -F'(  up |, )' '{ print ($3 ~ /user/) ? $2 : $2 " " $3 }')" \
  > up.json
git add up.json
git cmms up
