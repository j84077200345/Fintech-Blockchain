# 華南KYC房貸區塊鏈解決方案
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source-150x25.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

## 執行步驟:

1. Start the ganache-cli in the following directory

	/mykyc/node_modules/.bin/ganache-cli

2. Open remix GUI in any browser :
	
http://remix.ethereum.org/

3. Paste the code from file KYCSmartContract.sol in remix file.(choose compiler version 0.4.24+)

4. In run tab choose web3js environment in the default localhost port 8545 and then click deploy.

5. Copy the address from the deployed contract and replace it in the MyContract.js file's getAddress() function

6. Open new terminal go to mykyc/public/ directory.

7. Type the following command :
	
node server

8. Open new tab in browser go to :
	
http://localhost:3000/


