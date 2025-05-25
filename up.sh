systemstats -B $(cat /private/var/db/systemstats/current_boot_uuid) > systemstats.txt & sleep 10 && kill %1

printf '{
  "at": "%s",
  "up": "%s"
}' \
  $(date -Iseconds) \
  $(grep 'Total Time:' systemstats.txt | awk -F '(\t)' '{ print $2 }') \
  > up.json

rm -rf systemstats.txt

git add up.json
git cmms up
git push up
