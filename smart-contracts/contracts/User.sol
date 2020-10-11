pragma solidity ^0.6.0;

import "./Ownable.sol";

contract User is Ownable{
    bytes32 private hashPK;
    string private ipfs;
    constructor(bytes32 _hashPK, string memory _ipfs) public {
        hashPK = _hashPK;
        ipfs = _ipfs;
    }
    
    event NewHash(bytes32 indexed prevHashPK, bytes32 indexed newHash);
    event NewIpfs(string indexed prevIpfs, string indexed newIpfs);
     
    function checkHash(bytes32 _hashPK) public view returns(bool){
        return hashPK == _hashPK;
    }
    
    function getIPFS() public view returns(string memory){
        return ipfs;
    }
    
    function setHash(bytes32 newHash) onlyOwner public{
        bytes32 prevHashPK = hashPK;
        hashPK = newHash;
        emit NewHash(prevHashPK, newHash);
    }
    
    function setIPFS(string memory newIpfs) onlyOwner  public{
        string memory prevIpfs = ipfs;
        ipfs = newIpfs;
        emit NewIpfs(prevIpfs, newIpfs);
    }
}
