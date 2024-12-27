// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {NFTVOTING} from "../src/NFTVOTING.sol";

contract Deploy is Script {
    

   function run() public {
    vm.startBroadcast();
new NFTVOTING();
    vm.stopBroadcast();
    }
}