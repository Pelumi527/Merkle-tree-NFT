/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { addresses } from './address';
import Web3 from 'web3'

// Import Images + CSS
import logo from '../images/logo.png'
import smallLogo from '../images/logo-small.png'
import Fusion from '../images/OceanFusion1024.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


// Import ABI + Config
import TheoNFT from '../abis/TheoNFT.json';
import CONFIG from '../config.json';
import { Navbar,Container, Image, Row, Col, Alert } from 'react-bootstrap';
import {BsYoutube, BsTwitter, BsInstagram, BsLinkedin, BsWhatsapp} from 'react-icons/bs'
import {MDBAnimation} from 'mdbreact';

function App() {
	const [web3, setWeb3] = useState(null)
	const [openEmoji, setOpenEmoji] = useState(null)
	const [nftContract, setNftContract] = useState(null);
	const [totalSupply, setTotalSupply] = useState(0)
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
	const [presalePrice, setPresalePrice] = useState(0)
	const [totalMinted,settotalMinted] = useState(0);
	const [allowedToMint, isAllowedtoMint] = useState(0)
	const [show, setShow] = useState(false);
	const [mintprice, setMintPrice] = useState(0)
	const [check, setcheck] = useState(false);


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
			
				const THEONFT = new web3.eth.Contract(TheoNFT.abi, "0x02DCF53A5da78437b3d60A22F7D6d1133b150786")
				setNftContract(THEONFT)
				const mintprice= await nftContract.methods.price().call()	
				setPrice(mintprice)
				const totalMinted = await nftContract.methods.totalMinted().call()
				settotalMinted(totalMinted)
				const maxSupply = await nftContract.methods.maxSupply().call()
				setTotalSupply(maxSupply)
				const presale = await nftContract.methods.presale().call()
				setIsPresale(presale);
				const preSalePrice = await nftContract.methods.presalePrice().call()
				setPresalePrice(preSalePrice)

				if(presale == true){
					
					setMintPrice(Web3.utils.fromWei(presalePrice, 'ether'))
				}

				if(presale == false){
					setMintPrice(Web3.utils.fromWei(mintprice, 'ether'))
				}
				

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
			let	ans = addresses.find(o => o.address == account)
			isAllowedtoMint(ans.max)
			//mintable()
		}
	}

	

	const verify = async (account) => {
		//console.log(account)
		
		let	ans = addresses.find(o => o.address == account)
		//console.log(ans)
		//console.log(ans.proof, ans.leaf, ans.max)
		try {
			const verified = await nftContract.methods.verification(ans.proof, ans.leaf, ans.max).send({from: account})
		} catch (error) {
			if(error){
				setIsMinting(true)
				setShow(true)
				console.log("eddd")
				//console.log(isMinting, "wghy")
			}
		
		}
	 	//console.log(verified, "verified")

		// if(verified == false){
		// 	window.alert("You are not eligible for presale")
		// }

		// return verified;
		
	}
	
	const mintNFTHandler = async () => {
		console.log(check)
		if(check == false){
			try {
				let	ans = addresses.find(o => o.address == account)
				isAllowedtoMint(ans.max)
			} catch (error) {
				setIsMinting(true)
				setShow(true)
			}
			
			// console.log(allowedToMint)
			// setcheck(true)
	}
		//console.log(isMinting, "1")
		// Mint NFT
		if (nftContract) {
			// setIsMinting(true)
			// setIsError(false)
			
			const status =	await nftContract.methods.isVerified(account).call()
			console.log(isPresale,"status", status)
			if(status == false && isPresale == true ){
				verify(account) 
				console.log("errrod")
			}
			//console.log(isMinting, "2")
			
			let totalweiCost
			if (isPresale == false){
				 totalweiCost = String(isprice * mintAmount)
				 setMintPrice(totalweiCost)
			} else{
				totalweiCost = String(presalePrice * mintAmount)
				setMintPrice(totalweiCost)
			}

			

				await nftContract.methods.mint(mintAmount).send({ from: account, value: totalweiCost})
					.on('confirmation', async () => {
						const totalMinted = await nftContract.methods.totalMinted().call()
					})
					.on('error', (error) => {
						window.alert(error)
						setIsError(true)
				})

				if(isPresale == true){
					const preSaleMax =	await nftContract.methods.preSaleMaxMintAmount(account).call()
					const presaleMint = await nftContract.methods.presaleMinted(account).call()
					isAllowedtoMint(preSaleMax - presaleMint)
				}

				if(isPresale == false){
					const maxPublic = await nftContract.methods.maxPublicAmount().call()
					const maxMint = await nftContract.methods.maxMintable(account).call()
					isAllowedtoMint(maxPublic - maxMint)
				}

			
		}
		
		// setIsMinting(false)
	};

	useEffect(() => {
		loadWeb3();
	}, [account]);

	useEffect(() => {
		loadBlockchainData()
	},[loadBlockchainData]);

	// useEffect(() => {
	// 	mintable()
	// }, [mintable])

	return (
		<div>
			<Navbar className='header' bg="" expand="lg">
  				<Container fluid>
					<Navbar.Brand href="#home">
					<img
						src={logo}
						width="138"
						height=""
						className="d-inline-block align-top"
						alt="astrogem logo"
					/>
					</Navbar.Brand>
					{account ? (
					<a
						href={`https://etherscan.io/address/${account}`}
						target="_blank"
						rel="noopener noreferrer"
						className="button nav-button btn-sm mx-4">
						{account.slice(0, 5) + '...' + account.slice(38, 42)}
					</a>
				) : (
					<button onClick={web3Handler} className="header-btn"> Connect MetaMask</button>
				)}
				</Container>
			</Navbar>
			<main>
				<Row className='container-fluid fusion-div'>
					<Col md={12} lg={6}>
						<div>
							<img className='image-about-me' src={Fusion} alt='fusion'></img>
						</div>
					</Col>
					<Col md={12} lg={6
					}>
						<h2>The Fusion</h2>
						<p className="paragraph-large">8000 unique NFTs crafted with a blend of 3D and 2 Layers of AI.</p>
						<ul className='list-gradient-container'>
							<div className="list-item-gradient">
								<div><strong>Mint </strong>0.04 ETH</div>
							</div>
							<div className='list-item-gradient'>
								<div><strong>Whitelist Mint - </strong>Monday Jan. 6</div>
							</div>
							<div className='list-item-gradient'>
								<div><strong>Public Sale - </strong>Saturday Jan. 8</div>
							</div>
						</ul>
						<div className="mg-top-48px">
							<div className="button-container ">
								<a href="#mint" className="button-primary w-button">Mint</a>
							</div>
						</div>
					</Col>
				</Row>
				<Row className='mint-div'>
					<MDBAnimation  reveal type="fadeInRight" duration="3s">
					<Col md={12} lg={12} sm={12}>
						<div className='mg-top-48px'>
							<h2 id="mint" className="mint-page">Mint</h2>
            				<h5 >Pre-Sale: LIVE</h5>
							<h5>Public Sale:Sat. January 8th</h5>
							<h5>0.04 ETH</h5>
							<div className="w-form"> 
								<form id="wf-form-Mint-Quantity" name="wf-form-Mint-Quantity" data-name="Mint Quantity" method="get">
									<input type="number" placeholder="MintAmount" onChange={handleMintAmount}></input>
								</form>
							</div>
							{check == true ? 
							<p>{`The connected wallet has ${allowedToMint} avaliable`}</p>:<p></p>}
							<div>
								<button onClick={mintNFTHandler} className="mint-button"><span>{`Mint for ${mintprice} ETH`}</span></button>
							</div>
							{show ?<MDBAnimation reveal type="slide-in-down" duration="3s"> <Alert variant="danger" onClose={() => setShow(false)} dismissible>
								
								<Alert.Heading>Oh snap! You Got an error!</Alert.Heading>
								<p>
								"You must have an astroGem, Krakenship or rare-crypto-rocket to claim your free mint or you must
								fvg sign the transaction"
								</p>
							</Alert> </MDBAnimation>: <p></p>}
							<p>{`NFT's Left: ${totalMinted}/${totalSupply}`}</p>
						</div>
					</Col>
					</MDBAnimation>
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
								</a>
							}
							{CONFIG.NETWORKS[currentNetwork] && (
								<p>Current Network: {CONFIG.NETWORKS[currentNetwork].name}</p>
							)}
						</div>
					)}
				</Row>
				<Row className='footer-div'>
					<Col md={12} lg={4}>
						<div className='footer-img-container'>
							<Image className='footer-img' fluid src={smallLogo} width='100px' sizes="(max-width: 479px) 67px, 70px"></Image>
						</div>
					</Col>
					<Col md={12} lg={4}>
						<div className='footer-nav'>
							<div>
								<a href="index.html" className="nav-link footer">Mint</a>
							</div>
							<div>
								<a href="https://nfttemplate.webflow.io/#about" className="nav-link footer">Fusion</a>
							</div>
							<div>
								<a href="https://nfttemplate.webflow.io/#about" className="nav-link footer">Genesis</a>
							</div>
							<div>
								<a href="https://nfttemplate.webflow.io/#about" className="nav-link footer">Charter</a>
							</div>
							<div>
								<a href="https://nfttemplate.webflow.io/#about" className="nav-link footer">Team</a>
							</div>
						</div>
					</Col>
					<Col md={12} lg={4}>
						<div className='footer-right'>
							<div className='social-link'>
								<a href='#'><BsTwitter /></a>
							</div>
							<div className='social-link'>
								<a href='#'><BsInstagram /></a>
							</div>
							<div className='social-link'>
								<a href='#'><BsLinkedin /></a>
							</div>
							<div className='social-link'>
								<a href='#'><BsYoutube /></a>
							</div>
							<div className='social-link'>
								<a href='#'><BsWhatsapp /></a>
							</div>
						</div>
					</Col>
				</Row>
			</main>
		</div>
	)
}

export default App;