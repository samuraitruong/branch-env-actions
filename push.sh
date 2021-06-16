git push --delete origin v1 || true
git tag -d v1 || true
git add --all
git commit -am "v1"
git tag v1
git push 
git push --tags

