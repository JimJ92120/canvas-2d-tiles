rm -rf index.* assets

mkdir build
git clone https://github.com/JimJ92120/canvas-2d-tiles.git build

npm install --prefix=./build
npm run build --prefix=./build

cp -r ./build/dist/* .

rm -rf ./build
