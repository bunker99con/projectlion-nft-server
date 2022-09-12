// Klaytn IDE uses solidity 0.4.24, 0.5.6
pragma solidity >=0.4.24 <=0.5.6;

contract NFTSimple {
    string public name = "KlayLion";
    string public symbol = "KL";

    mapping (uint256 => address) public tokenOwner;
    mapping (uint256 => string) public tokenURIs;
    mapping (address => uint256[]) private _ownedTokens;

    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;

    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI)  public returns(bool) {
        // to에게 tokenId(일련번호)를 발행하겠다
        // 적힐 글자는 tokenURI
        tokenOwner[tokenId] = to;
        tokenURIs[tokenId] = tokenURI;
        // add token to the list
        _ownedTokens[to].push(tokenId);
        return true;
    }
    
    function ownedTokens(address owner) public view returns(uint256[] memory) {
        return _ownedTokens[owner];
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public { 
        require(from == msg.sender, "from != msg.sender");
        require(from == tokenOwner[tokenId], "be owner to buy nft");
        
        _removeTokenFromList(from, tokenId);
        _ownedTokens[to].push(tokenId);
        tokenOwner[tokenId] = to;

        // 만약에 받는 쪽이 실행할 코드가 있는 스마트 컨트랙트이면 코드 실행
        require(
            _checkOnKIP17Received(from, to, tokenId, _data), "KIP17: transfer to non KIP17Rexeiver implementer"
        );
    }

    function _checkOnKIP17Received(address from, address to, uint256 tokenId, bytes memory _data) internal returns (bool) {
        bool success;
        bytes memory returndata;

        if (!isContract(to)) {
            return true;
        }
        (success, returndata) = to.call(
            abi.encodeWithSelector(
                _KIP17_RECEIVED,
                msg.sender,
                from,
                tokenId,
                _data
            )
        );
        if (
            returndata.length != 0 &&
            abi.decode(returndata, (bytes4)) == _KIP17_RECEIVED
        ) {
            return true;
        }
            return false;
        }

        function isContract(address account) internal view returns (bool) {
            uint256 size;
            assembly { size := extcodesize(account)}
            return size > 0;
        }

    function _removeTokenFromList(address from, uint256 tokenId) private {
        uint256 lastTokenIdex = _ownedTokens[from].length - 1;
        for(uint256 i=0;i<_ownedTokens[from].length;i++) {
            if(tokenId == _ownedTokens[from][i]) {
                // swap last token with deleting token;
                _ownedTokens[from][i] = _ownedTokens[from][lastTokenIdex];
                _ownedTokens[from][lastTokenIdex] = tokenId;
                break;               
            }
        }
        _ownedTokens[from].length--;
    }

    function setTokenUri(uint256 id, string memory uri) public { 
        tokenURIs[id] = uri;
    }
}

contract NFTMarket {
    mapping(uint256 => address) public seller;

    function buyNFT(uint256 tokenId, address NFTAddress) public payable returns (bool) {
        address payable receiver = address(uint160(seller[tokenId]));
        receiver.transfer(1);
        NFTSimple(NFTAddress).safeTransferFrom(address(this), msg.sender, tokenId, '0x00');
        return true;
    }
    
    function onKIP17Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4) {
        seller[tokenId] = from;
        return bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)"));
    }
}
