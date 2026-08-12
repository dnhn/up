printf '{
  "at": "%s",
  "boot": %d
}' \
  "$(date -Iseconds)" \
  "$(sysctl -n kern.boottime | awk -F '[^0-9]+' '{ print $2 }')" \
  > up.json

git add up.json
git cmms up
git push up
