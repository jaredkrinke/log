#!/bin/sh

cd out
git add .
git status
echo "Press enter to continue..."
read dummy
git commit -m Update
git push

