git push --delete origin v1.0 || true
git tag -d v1.0 || true
git add --all
git commit -am "v1.0"
git tag v1.0
git push 
git push --tags

