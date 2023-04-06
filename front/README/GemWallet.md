GemWallet
download release2 from github
yarn install
npm run build:api:npm
rm -rf ~/Documents/SaveRepo/FoodTrustSimulator/front/node_modules/@gemwallet/api/
cp -r packages/api/dist/ ~/Documents/SaveRepo/FoodTrustSimulator/front/node_modules/@gemwallet/api/

---

install extension
npm run build
then open chrome, extension load unpacked 
/home/val/Downloads/gemwallet-extension-release-2.0.0/packages/extension/build