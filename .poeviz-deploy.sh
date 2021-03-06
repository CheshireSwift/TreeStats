#!/bin/bash
ssh poeviz@poeviz.com <<'ENDSSH'

cd site

# backup trees
tar cfv get_trees.tar TreeStats/task/get_trees/*_get_trees.csv

# update backend
cd TreeStats
git pull
yarn

cd ..

# update frontend
cd public
git pull

cd ..

# update trees
node TreeStats/task/build_sources_index.js TreeStats/task/get_trees public/TreeStats/sources_production.json data
find public/TreeStats/data/ -type f -name '*_get_trees.csv' -delete
cp TreeStats/task/get_trees/*_get_trees.csv public/TreeStats/data/

ENDSSH