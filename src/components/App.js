import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { address, maxAmount } from './address';
import { ethers } from 'ethers';
import {MerkleTree} from 'merkletreejs';
import {keccak256} from 'keccak256';
import Web3 from 'web3'

// Import Images + CSS
import logo from '../images/logo.png'
import happyImage from '../images/happy.png'
import excitedImage from '../images/excited.png'
import sadImage from '../images/sad.png'
import './App.css'

// Import ABI + Config
import TheoNFT from '../abis/TheoNFT.json';
import CONFIG from '../config.json';

function App() {
	const [web3, setWeb3] = useState(null)
	const [openEmoji, setOpenEmoji] = useState(null)
	const [nftContract, setNftContract] = useState(null);
	const [supplyAvailable, setSupplyAvailable] = useState(0)
	const [isPresale, setIsPresale] = useState(false);
	const [mintAmount, setmintAmount] = useState(0);

	const [account, setAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)

	const [blockchainExplorerURL, setBlockchainExplorerURL] = useState('https://etherscan.io/')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io/')

	const [isMinting, setIsMinting] = useState(false)
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)

	const [isprice, setPrice] = useState(0);

	const handleMintAmount = (e) => {
		setmintAmount(e.target.value)
	}

	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		 if (web3) {

			const networkId = await web3.eth.net.getId()
			setCurrentNetwork(networkId)

			if(networkId !== 4) {
				setMessage("Contract not deployed to current network, please change to the rinkeby network in MetaMask")
			}
			
			try {
			
				const THEONFT = new web3.eth.Contract(TheoNFT.abi, '0x416195c2A9Fcb4A3991C0A5Bfde2acCd96D127A1')
				setNftContract(THEONFT)
	
				const mintprice= await nftContract.methods.price().call()
					
				setPrice(mintprice)
	
				const totalMinted = await nftContract.methods.totalMinted().call()
				const maxSupply = await nftContract.methods.maxSupply().call()
				setSupplyAvailable(maxSupply - totalMinted)
				
	
				const presale = await nftContract.methods.presale().call()
			
				setIsPresale(presale);
	
				if (networkId !== 5777) {
					setBlockchainExplorerURL(CONFIG.NETWORKS[networkId].blockchainExplorerURL)
					setOpenseaURL(CONFIG.NETWORKS[networkId].openseaURL)
				}
				
			} catch (error) {
				setIsError(true)
			}
		 }
	}


	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined' && !account) {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)
		
			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setAccount(accounts[0])
			} else {
				setMessage('Please connect with MetaMask')
			}

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
				setMessage(null)
			});

			window.ethereum.on('chainChanged', (chainId) => {
				// Handle the new chain.
				// Correctly handling chain changes can be complicated.
				// We recommend reloading the page unless you have good reason not to.
				window.location.reload();
			});
		}
	}

	

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}
	const verify = async (account) => {
		const res = maxAmount.find(item => item[0] == account)

		const hashaddress = []
		for(var i = 0; i < address.length; i++){
			const leaves = ethers.utils.solidityKeccak256(["address"],[address[i]])
			hashaddress.push(leaves)
		}

		const tree = new MerkleTree(hashaddress, keccak256, {
			sortPairs: true,
		})

		

		const leaf = ethers.utils.solidityKeccak256(["address"],[res[0]])
	
		const proof = tree.getHexProof(leaf)
		

		
		
		
		const verified = await nftContract.methods.verification(proof,leaf,res[1])
		if(verified == false){
			window.alert("You are not eligible for presale")
		}
		
	}
	const mintNFTHandler = async () => {
		

		// Mint NFT
		if (nftContract) {
			setIsMinting(true)
			setIsError(false)

			

			
			if(isPresale == true){
				verify(account)
			}

			
			let totalweiCost
			if(isPresale == false){
				 totalweiCost = String(isprice * mintAmount)
			}else{
				totalweiCost = String(isprice * 0)
			}

			
			await nftContract.methods.mint(mintAmount).send({ from: account, value: totalweiCost})
				.on('confirmation', async () => {
					const totalMinted = await nftContract.methods.totalMinted().call()
					 setSupplyAvailable(1000 - totalMinted)
				})
				.on('error', (error) => {
					window.alert(error)
					setIsError(true)
				})
		}

		setIsMinting(false)
	};

	useEffect(() => {
		loadWeb3()
	}, [account]);

	useEffect(() => {
		loadBlockchainData()
	},[loadBlockchainData]);

	return (
		<div>
			<nav className="navbar fixed-top mx-3">
				<a
					className="navbar-brand col-sm-3 col-md-2 mr-0 mx-4"
					href="http://www.dappuniversity.com/bootcamp"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={logo} className="App-logo" alt="logo" />
					Dapp University
				</a>

				{account ? (
					<a
						href={`https://etherscan.io/address/${account}`}
						target="_blank"
						rel="noopener noreferrer"
						className="button nav-button btn-sm mx-4">
						{account.slice(0, 5) + '...' + account.slice(38, 42)}
					</a>
				) : (
					<button onClick={web3Handler} className="button nav-button btn-sm mx-4">Connect Wallet</button>
				)}
			</nav>
			<main>
				<Row className="my-3">
					<Col className="text-center">
						<h1 className="text-uppercase">Open Emojis</h1>
					</Col>
				</Row>
				<Row className="my-4">
					<Col className="panel grid" sm={12} md={6}>
						<input type="number" placeholder="MintAmount" onChange={handleMintAmount}></input>
						
						<button onClick={mintNFTHandler} className="button mint-button"><span>Mint</span></button>
						
					</Col>
					<Col className="panel grid image-showcase mx-4">
						<img
							src={isError ? (
								sadImage
							) : !isError && isMinting ? (
								excitedImage
							) : (
								happyImage
							)}
							alt="emoji-smile"
							className="image-showcase-example-1"
						/>
					</Col>
				</Row>
				<Row className="my-3">
					<Col className="flex">
						<a href={openseaURL + account} target="_blank" rel="noreferrer" className="button">View My Opensea</a>
						<a href={`${blockchainExplorerURL}address/${account}`} target="_blank" rel="noreferrer" className="button">My Etherscan</a>
					</Col>
				</Row>
				<Row className="my-2 text-center">
					{isError ? (
						<p>{message}</p>
					) : (
						<div>
							{openEmoji &&
								<a href={`${blockchainExplorerURL}address/${nftContract._address}`}
									target="_blank"
									rel="noreferrer"
									className="contract-link d-block my-3">
									{openEmoji._address}
								</a>
							}

							{CONFIG.NETWORKS[currentNetwork] && (
								<p>Current Network: {CONFIG.NETWORKS[currentNetwork].name}</p>
							)}

							
						</div>
					)}
					<p>{`NFT's Left: ${supplyAvailable}`}</p>
				</Row>
			</main>
		</div>
	)
}

export default App;
