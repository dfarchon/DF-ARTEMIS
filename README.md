

<div align="center">
	<img width="200" src="https://user-images.githubusercontent.com/25214732/188123637-d020cd5b-2f69-4436-a279-87f3d36312db.PNG" alt="DF GAIA">
</div>

<p align="center">
	<b>DF ARTEMIS</b>
</p>

<p align="center">
  Contributor: <a href="https://twitter.com/DfArchon">@DfArchon</a>
</p>

# DF ARTEMIS

## 0. Introduction

Planet-targeted bounty mercenary system for Dark Forest.

Funder publish task(s) for attacking planet(s).

Mercenaries attack the planet(s) to get reward.

Manager confirm the result and distribute ETH.

use [SubGraph](https://thegraph.com/en/) to query the history log of arrivals to one planet.

**Funder and Mercenaries need to trust Manager**, 
the smart contract determine the rules.

中文使用指南： https://www.youtube.com/watch?v=UsrTy-AgXMo


## 1. Warning 

**The smart contract and plugin have not been audited** .

 **use plugin at your own risk .**

The smart contract has not been rigorously tested. It is possible that your tokens can be lost or stolen by hackers due to bugs that are not easily found in smart contracts.

The plugin runs in your game environment, has access to all your private information (including private keys),  and can dynamically load data.

Before using a plugin, it is recommended that you have a complete understanding of the specific plugin content and review it before using it.



## 2. How To Use

Go into one dark forest lobby,  add a new plugin, and input the below code.

```js
export {default} from "https://cdn.jsdelivr.net/gh/dfarchon/artemis-dest@master/Artemis-v0.0.2.js"
```

## 3. How To Develop

Run the command in the repository folder:

```
df-plugin-dev-server
```

 Put below content in the Dark Forest UI to load DF ARTEMIS plugin.

```js
export { default } from "http://127.0.0.1:2222/ArtemisPlugin.js?dev";
```

## 4. Thanks

In the process of developing and testing DF ARTEMIS,  we would like to express our heartfelt thanks to all the friends who provided us with help and feedback.

Special thanks to **ZKForest Community**, which give me a lot of support.

Speical thanks to **Project Sophon**, which is the development team of [df-plugin-dev-server](
https://github.com/projectsophon/df-plugin-dev-server).


Special thanks to [DarkSea](https://github.com/snowtigersoft/darksea-market)'s developer @snowtigersoft, who enthusiastically answered all questions about smart contracts.

Special thanks to [ClassicJordon](https://twitter.com/ClassicJordon), who helped to determine the plan for English front-end and organize testing activities.

## 5. Reference link

https://github.com/darkforest-eth/eth

https://github.com/snowtigersoft/darksea-market

https://github.com/dfarchon/DF-GAIA

https://github.com/projectsophon/df-plugin-dev-server


## License

GNU General Public License v3.0


