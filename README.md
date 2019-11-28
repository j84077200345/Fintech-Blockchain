# 華南房貸KYC區塊鏈解決方案
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source-150x25.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

## 執行步驟:

1. 啟動 ganache-cli 建立以太坊私有鏈。

2. 在瀏覽器中開啟 remix GUI :
	
http://remix.ethereum.org/

3. 複製 KYCSmartContract.sol 檔案到 remix 中。(編譯器版本請選擇 0.4.24+)

4. 執行環境選擇 web3js，也就是 ganache 所在的localhost 8545 port，並把合約部署到私有鏈上。

5. 複製部署好的合約地址到 MyContract.js檔案中的 getAddress() function

6. 開啟新的終端器，接著進入 mykyc/public/ 路徑.

7. 輸入以下兩個指令 :

npm install
node server

8. 在瀏覽器中輸入以下網址 :
	
http://localhost:3000/


