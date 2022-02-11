/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { addresses } from './address';
import Web3 from 'web3'

// Import Images + CSS
import logo from '../images/garvenlogo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import discordIcon from "../images/discord-icon.png";
import OpenseaIcon from "../images/Opensea-Logomark-Transparent-White.png"
import {BsInstagram, BsTwitter} from "react-icons/bs"


// Import ABI + Config
import TheoNFT from '../abis/TheoNFT.json';
import CONFIG from '../config.json';
import { Row, Col, Alert, Modal,Spinner } from 'react-bootstrap';
import {MDBAnimation} from 'mdbreact';
// @ts-ignore
import Lightboxes from './lightbox';



function App() {
	const [web3, setWeb3] = useState(null)
	const [openEmoji, setOpenEmoji] = useState(null)
	const [nftContract, setNftContract] = useState(null);
	const [totalSupply, setTotalSupply] = useState(0)
	const [isPresale, setIsPresale] = useState(false);
	const [mintAmount, setmintAmount] = useState(1);

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
	const [mintprice, setMintPrice] = useState(1)
	const [check, setcheck] = useState();
	const [balance, setbalance] = useState(0);
	const [gottenBal, setgottenBal] = useState(0);
	const [status, setstatus] = useState(false);
	const [smShow, setSmShow] = useState(false);
	const [smShow2, setSmShow2] = useState(false);
	const [smShow3, setSmShow3] = useState(false);


	const handleMintAmount = (e) => {
		setmintAmount(e.target.value)
	}


	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		 if (web3) {

			const networkId = await web3.eth.net.getId()
			setCurrentNetwork(networkId)

			if(networkId !== 1) {
				setMessage("Contract not deployed to current network, please change to the ethereum network in MetaMask")
			}
			
			try {

			
				const THEONFT = new web3.eth.Contract(TheoNFT.abi, "0xc40228EB5392Cebe9b42655C1CD6BA53b3658920")
				setNftContract(THEONFT)

				const mintprice= await nftContract.methods.price().call()	
				setPrice(mintprice)
				//console.log(mintprice)

				const totalMinted = await nftContract.methods.totalMinted().call()
				settotalMinted(totalMinted)

				const maxSupply = await nftContract.methods.maxSupply().call()
				setTotalSupply(maxSupply)

				const presale = await nftContract.methods.presale().call()
				setIsPresale(presale);
			
				const preSalePrice = await nftContract.methods.presalePrice().call()
				setPresalePrice(preSalePrice)
				
				const status =	await nftContract.methods.isVerified(account).call()
				setstatus(status)

				

				
				if(presale == true){
					setMintPrice(Web3.utils.fromWei(presalePrice, 'ether')*(mintAmount*1))
					const presaleMint = await nftContract.methods.presaleMinted(account).call()
					setbalance(presaleMint)
					const preSaleMax =	await nftContract.methods.preSaleMaxMintAmount(account).call()
					setgottenBal(preSaleMax - presaleMint)
				}

				

				if(presale === true && status === true){
					const presaleMint = await nftContract.methods.presaleMinted(account).call()
					setbalance(presaleMint)
					const preSaleMax =	await nftContract.methods.preSaleMaxMintAmount(account).call()
					setgottenBal(preSaleMax - presaleMint)
					isAllowedtoMint(preSaleMax - presaleMint)
				}

				if(presale == false){
					setMintPrice(Web3.utils.fromWei(mintprice, 'ether')*(mintAmount))
				}

				if(isPresale == false){
					const maxPublic = await nftContract.methods.maxPublicAmount().call()
					const maxMint = await nftContract.methods.maxMintable(account).call()
					setbalance(maxMint)
					setgottenBal(maxPublic - maxMint)
					isAllowedtoMint(maxPublic)
				}

				if(isPresale == true && status == false ){
					try{
						//console.log(accounts[0], "accs")
						let	ans =  addresses.find(o => o.address == account)
						isAllowedtoMint(ans.max) 
					} catch(error){
						console.log(error)
					}
					firstmax(account)

					//firstmax(account)
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

	const firstmax = async (account) => {
		try{
			let	ans = addresses.find(o => o.address == account)
			isAllowedtoMint(ans.max)
		} catch(error){
			console.log(error)
		}
	}

	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined' && !account) {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)
		
			const accounts = await web3.eth.getAccounts()
			if (accounts.length > 0) {
				setAccount(accounts[0])
				setcheck(accounts[0])
				
			} else {
				setMessage('Please connect with MetaMask')
			}

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
				setcheck(accounts[0])
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
			setcheck(accounts[0])
		}
	}

	

	const verify = async (account) => {
		console.log(account, "1")
		
		let	ans = addresses.find(o => o.address == account)
		//console.log(ans)
		//console.log(ans.proof, ans.leaf, ans.max)
		try {
			const verified = await nftContract.methods.verification(ans.proof,ans.max).send({from: account})
		} catch (error) {
			if(error){
				console.log(error)
				setIsMinting(true)
				setShow(true)
			}
		
		}
	 	
		
	}
	
	const mintNFTHandler = async () => {

		if (nftContract) {
			// setIsMinting(true)
			 
			// setIsError(false)
			const status =	await nftContract.methods.isVerified(account).call()
			console.log(isPresale,"status", status)
			if(status == false && isPresale == true ){
				setSmShow(true)
				await verify(account) 
				setSmShow(false)
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

			
				setSmShow2(true)
				await nftContract.methods.mint(mintAmount).send({ from: account, value: totalweiCost})
					.on('confirmation', async () => {
						setSmShow2(false)
						
						const totalMinted = await nftContract.methods.totalMinted().call()
					})
					.on('error', (error) => {
						console.log(error)
						setIsError(true)
						setSmShow2(false)
					})
					setSmShow3(true)
				if(isPresale == true){
					const preSaleMax =	await nftContract.methods.preSaleMaxMintAmount(account).call()
					const presaleMint = await nftContract.methods.presaleMinted(account).call()
					setbalance(presaleMint)
					setgottenBal(preSaleMax - presaleMint)
					//console.log(gottenBal, "why")
				}

				if(isPresale == false){
					const maxPublic = await nftContract.methods.maxPublicAmount().call()
					const maxMint = await nftContract.methods.maxMintable(account).call()
					setbalance(maxMint + 1)
					setgottenBal(maxPublic - maxMint)
				}

			
		}
		
		// setIsMinting(false)
	};

	
	useEffect(() => {
		loadBlockchainData()
		//console.log("you")
	},[loadBlockchainData]);

	useEffect(() => {
		loadWeb3();
		console.log("mee")
		
	}, [account]);

	

	return (
		<div>
			<div className='header-top'>
				<div className="split-content header-left">
					<a href="https://garvenlabs.xyz/" className="brand-logo w-nav-brand">
						<div className="div-block-2"><img src={logo} alt="astrogems logo" className="header-logo laptop mobile"/></div>
					</a>
				</div>
			</div>
			<div className="container-header home-header">
				<div className="split-content header-left tablet">
					<a href="https://garvenlabs.xyz/" className="brand-logo w-nav-brand">
						<div className="div-block-2"><img src={logo} alt="astrogems logo" className="header-logo"/></div>
					</a>
				</div>
        		
        		<div className="div-block-4">
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
        		</div>
      		</div>
			<main>
			<Modal
				size="sm"
				show={smShow}
				onHide={() => setSmShow(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-sm">
					Verifying your wallet.......
				</Modal.Title>
				</Modal.Header>
				<Modal.Body>...</Modal.Body>
			</Modal>
			<Modal
				size="sm"
				show={smShow2}
				onHide={() => setSmShow2(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-sm">
						
				<Spinner animation="border" role="status">
  					<span className="visually-hidden"></span>
				</Spinner>
				Minting....
				</Modal.Title>
				</Modal.Header>
				<Modal.Body>...</Modal.Body>
			</Modal>
			<Modal
				size="sm"
				show={smShow3}
				onHide={() => setSmShow3(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-sm">
						<p className='text-success'>Minting succesful</p>
				</Modal.Title>
				</Modal.Header>
				<Modal.Body>...</Modal.Body>
			</Modal>
				<Row className='mint-div'>
					<MDBAnimation  reveal type="fadeInRight" duration="3s">
					<Col md={12} lg={12} sm={12}>
						<div className='mg-top-48px'>
							<h2 id="mint" className="mint-page">Mint</h2>
            				{/* <h5 >Presale: LIVE</h5> */}
							<h5>Whitelist Mint: 
								FEB 11</h5>
							<h5>Public Sale: FEB 12</h5>
							<h5>Price: Free to Mint</h5>
							{balance > 0 ? 
							<p>{`The connected wallet has ${gottenBal} available`}</p>: account ? <p> { `The connected wallet has ${allowedToMint} available`}</p>:<p></p>}
							<div className="w-form">
								<form id="wf-form-Mint-Quantity" name="wf-form-Mint-Quantity" data-name="Mint Quantity" method="get">
									<input type="number" placeholder="1" onChange={handleMintAmount}></input>
								</form>
								<p>Quantity to mint</p>
							</div>
							
							<div>
								{account ? <button onClick={mintNFTHandler} className="mint-button"><span>{`Mint for ${mintprice} ETH`}</span></button>:<button onClick={web3Handler} className="header-btn"> Connect MetaMask</button>}
							</div>
							{show ?<MDBAnimation reveal type="slide-in-down" duration="3s"> <Alert variant="danger" onClose={() => setShow(false)} dismissible>
								
								<Alert.Heading>Attention</Alert.Heading>
								<p>
								"You must have an astroGem, Krakenship or rare-crypto-rocket to claim your free mint or you must
								sign the transaction"
								</p>
							</Alert> </MDBAnimation>: <p></p>}
							<p>{`${totalMinted}/${7000} Minted`}</p>
						</div>
					</Col>
					</MDBAnimation>
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
				</Row>
				<Lightboxes />
				<footer className='footer'>
				<div className="container-default">
        <div className="footer-top">
          <div className="footer-top-left">
            <a href="https://garvenlabs.xyz/" className="footer-logo-container w-inline-block"><img src={logo} alt="" className="footer-logo"/></a>
          </div>
          <div>
            <ul className="list-social-media">
              <li className="list-item-social-media">
                <a href="https://twitter.com/astrogems1000" className="social-media-icon"><BsTwitter/></a>
              </li>
              <li className="list-item-social-media">
                <a href="https://www.instagram.com/astrogemsnft" className="social-media-icon"><BsInstagram /></a>
              </li>
              <li className="list-item-social-media">
                <a href="https://discord.gg/cuanRJM2Bb" target="_blank" className="link-block w-inline-block" rel="noreferrer"><img src={discordIcon} loading="lazy" width="20" alt="" className="image-7"/></a>
              </li>
              <li className="list-item-social-media _2">
                <a href="https://opensea.io/collection/astrogems" target="_blank" className="link-block w-inline-block" rel="noreferrer"><img src={OpenseaIcon} loading="lazy" width="20" alt="" className="image-9"/></a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom"></div>
      </div>
	  </footer>
			</main>
		</div>
	)
}

export default App;