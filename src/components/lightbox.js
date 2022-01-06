


import React from 'react';
                        // @ts-ignore
import { LightBox } from 'react-lightbox-pack'; // <--- Importing LightBox Pack
import "react-lightbox-pack/dist/index.css";
import './App.css'
//import data from "../images.js"



const Lightboxes = () => {
    const [toggle, setToggle] =  React.useState(false);
	const [sIndex, setSIndex] =  React.useState(0);


    const data = [
        {"id": 1   ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9dc159b75b838ff96b71_JC0ENSX91GW6riRqHlUV-2-p-500.jpeg'},
        {"id": 2   ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9d6f2534ebf5082c1399_ES8Lv7VfCK8GJJrsK7nS_9.1743x-p-1600.jpeg'},
        {"id": 3  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9d6084ff60fb7093adeb_9YzecGDyy41vnB8ICyrW_9.1743x-p-1600.jpeg'},
        {"id": 4  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9c428c700145abefc903_G4OWOx8aDq5qzyClsjw5_9.1743x-p-1600.jpeg'},
        {"id": 5  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9c21308c17abba5bb32d_VBDLOsmO42flKPw9ZqwB--100--PQWMT_9.1743x-p-1600.jpeg'},
        {"id": 6  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9c17308c1781af5bb26c_LqOOzRhd6UHTybHxNyqi_9.1743x(1)-p-1600.jpeg'},
        {"id": 7  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9c0c78cdb74d7332371c_4IvR3VLeAmY1jJr1arWc_9.1743x-p-1600.jpeg'},
        {"id": 8  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9bfef926e2801d34011c_xV9tpQCD9LMsgbNaGqp2_9.1743x-2-p-1600.jpeg'},
        {"id": 9  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9bec311ff68991a05fb3_IL3Dkc1yMGtypFwYHevw.jpg'},
        {"id": 10  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9be3311ff6557fa05fa7_m7JicpZDiD9uwW6dxQji.jpg'},
        {"id": 11  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9bd859b75b5a75f96688_ZRcQjyRChjGPCISkgZe1_9.1743x-p-1600.jpeg'},
        {"id": 12  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca9bce20597dafc49fdecb_UBnTXtiwm96jpUiiF3jC--50--QUSI1_9.1743x-p-1600.jpeg'},
        {"id": 13  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6fdf9ffcee8806f0b0f2_ydTx7D20uvSC4bWvwRN9_9.1743x-p-1600.jpeg'},
        {"id": 14  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6fc69ffceeeec5f0b0e3_weyb2E4KWk1EWC9kMdbu_9.1743x-p-1600.jpeg'},
        {"id": 15  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6fb759b75b6a2ff84a52_PkHjwPVwV6XT1QLhw3of_9.1743x-p-1600.jpeg'},
        {"id": 16  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6fa7d11ee05db218a676_ovhSOE2nG3yBKwO0WLHP_9.1743x-p-1600.jpeg'},
        {"id": 17  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6f9a2174cd08e38356ad_lvjrjNDPNON9SnPLWAIk_9.1743x(1)-p-1600.jpeg'},
        {"id": 18  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6f8f00ce8e0e0613c3ff_IATCbLBhOrWAdUWJ2O5v_9.1743x-p-1600.jpeg'},
        {"id": 19  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6f83ea918dca0cfba2a4_Lmu6KGGICB9zWQA1OMtf_9.1743x-p-1600.jpeg'},
        {"id": 20  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6f250ce838ca4e93a304_cFafvRrpPx9ifnStOkSC_9.1743x-p-1600.jpeg'},
        {"id": 21  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6f17cf3e4c1d1785fd6b_54cEBnTad8ianImKZW5K_9.1743x-p-1600.jpeg'},
        {"id": 22  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6d2764049fa7345d154e_FraYWTovHZoLN7ZDpo8x.jpg'},
        {"id": 23  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6c3b20ddf00df5f13652_Qc0luuKWQ610NDynam86.jpg'},
        {"id": 24  ,"title": 'astrogem', "image": 'https://uploads-ssl.webflow.com/61bcf2707a26641725168ed6/61ca6c0220597d0fb39ebc16_VGTLpKaPbhkW3AHBvBrt--50--8W9RE.jpg'},
      ];
	// Handler
	const  lightBoxHandler  = (state, sIndex) => {
		setToggle(state);
		setSIndex(sIndex);
	};
    
	return (
		<div id='lightbox'>
			{/* /// data should be an array of object */}
			{data.map((item, index) => (
			<>
				
				<img
					key={item.id}
					src={item.image}
					alt={item.title}
					style={{ maxHeight:  "110px", maxWidth:  "115px"   }}
					onClick={() => {
					lightBoxHandler(true, index);
					}}
				/>
			</>
			))}
			
			{/* //Component */}
			<LightBox
				state={toggle}
                    event={lightBoxHandler}
                    data={data}
                    imageWidth="60vw"
                    imageHeight="70vh"
                    thumbnailHeight={20}
                    thumbnailWidth={20}
                    setImageIndex={setSIndex}
                    imageIndex={sIndex}
			/>
		</div>
	);
}

export default Lightboxes;
