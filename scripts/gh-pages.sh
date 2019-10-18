cd examples
yarn
yarn build
cp ./examples/build/index.html ./examples/build/404.html 
cd ..
yarn gh-pages -d ./examples/build