// SPDX-License-Identifier: MIT

pragma solidity =0.8.10;

import "../interfaces/compound/IComptroller.sol";
import "../interfaces/IERC20.sol";
import "../utils/Exponential.sol";
import "./helpers/ViewHelper.sol";

contract CompRewardView is Exponential, ViewHelper {
    IComptroller public constant comp = IComptroller(
        COMPTROLLER_ADDR
    );
    uint224 public constant compInitialIndex = 1e36;

    function _claim(
        address _user,
        address[] memory _cTokensSupply,
        address[] memory _cTokensBorrow
    ) internal {
        address[] memory u = new address[](1);
        u[0] = _user;

        comp.claimComp(u, _cTokensSupply, false, true);
        comp.claimComp(u, _cTokensBorrow, true, false);
    }

    function getBalance(address _user, address[] memory _cTokens) public  returns (uint256) {
        _claim(_user, _cTokens, _cTokens);

        return IERC20(COMP_ADDR).balanceOf(_user);
    }
}