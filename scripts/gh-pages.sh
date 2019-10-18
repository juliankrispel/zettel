cd examples
yarn
yarn build
cp build/index.html build/404.html 
cd ..
yarn gh-pages -d ./examples/build