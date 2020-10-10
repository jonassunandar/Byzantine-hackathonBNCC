pragma solidity 0.7.3;

import "./Ownable.sol";

contract User is Ownable{
    bytes32 private hashPK;
    bytes32 private ipfs;
    constructor(bytes32 _hashPK, bytes32 _ipfs) {
        hashPK = _hashPK;
        ipfs = _ipfs;
    }
    
    event NewHash(bytes32 indexed prevHashPK, bytes32 indexed newHash);
    event NewIpfs(bytes32 indexed prevIpfs, bytes32 indexed newIpfs);
    
    function checkHash(bytes32 _hashPK) public view returns(bool){
        return hashPK == _hashPK;
    }
    
    function getIPFS() public view returns(bytes32){
        return ipfs;
    }
    
    function setHash(bytes32 newHash) onlyOwner public{
        bytes32 prevHashPK = hashPK;
        hashPK = newHash;
        emit NewHash(prevHashPK, newHash);
    }
    
    function setIPFS(bytes32 newIpfs) onlyOwner public{
        bytes32 prevIpfs = ipfs;
        ipfs = newIpfs;
        emit NewIpfs(prevIpfs, newIpfs);
    }
}
