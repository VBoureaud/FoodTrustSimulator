import React, { useState, useEffect } from "react";
import { Carousel } from 'react-responsive-carousel';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import './ActivityDisplay.less';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "@utils/TypeToken.less";
import { 
	unPad,
} from "@utils/helpers";

import {
	nameTypeToken
} from "@utils/gameEngine";

const backgroundWidth = 1980;
const backgroundHeight = 1113;
const backgroundPadding = 24 * 2;
const sizeBtn = 100;

const farmerBtn = [{
		top: '75%',
		left: '20%',
		text: 'Play',
	}, {
		top: '45%',
		left: '30%',
		text: 'Play',
	}, {
		top: '60%',
		left: '48%',
		text: 'Play',
	}, {
		top: '15%',
		left: '72%',
		text: 'Play',
	}, {
		top: '75%',
		left: '68%',
		text: 'Play',
}];

const cookBtn = [{
		top: '58%',
		left: '3%',
		text: 'Freeze',
		type: 'freeze'
	}, {
		top: '57%',
		left: '21%',
		text: 'Bake',
		type: 'bake',
	}, {
		top: '50%',
		left: '48%',
		text: 'Mix',
		type: 'mix',
	}, {
		top: '35%',
		left: '72%',
		text: 'Recipe',
		type: '001000',
}];

const managerBtn = [{
		top: '73%',
		left: '15%',
		text: 'Coin',
		type: '002000'
	}, {
		top: '53%',
		left: '28%',
		text: 'Ad',
		type: 'ad',
	}, {
		top: '59%',
		left: '59%',
		text: 'Box',
		type: '002001',
	}
];

type btnReference = {
	top: string;
	left: string;
	text: string;
	type?: string;
}
type ActivityDisplayProps = {
	loading?: boolean;
	tokenMintable?: string[];
	onLaunchActivity?: Function;
	type: string;
	width: number;
	height: number;
	children?: JSX.Element;
};

const dictionnaryBtnType: {[key: string]: btnReference[]} = {
	farmer: farmerBtn,
	cook: cookBtn,
	manager: managerBtn,
};

const ActivityDisplay = (props: ActivityDisplayProps) => {
	const [nbBlock, setNbBlock] = useState(0);
	const [loading, setLoading] = useState(true);
	const [imgWidth, setImgWidth] = useState(0);
	const [imgHeight, setImgHeight] = useState(0);

	const translatorPosition = (windowId: number, windowSize: number, type: string) => {
		const btnList = dictionnaryBtnType[type];
		const btnFormatted = btnList.filter((elt, index) => {
			// Is position include in display ?
			const percentageX = parseInt(elt.left) / 100;
			const posX = percentageX * imgWidth;
			return (posX + sizeBtn > windowSize * windowId && posX < windowSize * (windowId + 1))
		}).map((elt, index) => {
			const newElt = {
				...elt
			};
			// calcul Y
			const percentageY = parseInt(elt.top) / 100;
			const posY = percentageY * imgHeight;

			// calcul X
			const percentageX = parseInt(elt.left) / 100;
			const posX = percentageX * imgWidth;
			newElt.top = posY + 'px';
			newElt.left = (posX - windowSize * windowId) + 'px';
			return newElt;
		});
		return btnFormatted;
	}

	const calculateSplit = async () => {
		// update ratio
		const howManyInWin = imgWidth / props.width;
		setNbBlock(parseInt(howManyInWin + '') + 1);		
	}

	const calculateSize = async () => {
		if (props.height < backgroundHeight) {
			// update ratio
			const widthCurrent = props.height * backgroundWidth / backgroundHeight;
			await setImgWidth(widthCurrent);
			await setImgHeight(props.height);
		} else {
			await setImgWidth(backgroundWidth);
			await setImgHeight(backgroundHeight);
		}		

		/*if (howManyInWin > 1 && imgWidth % props.width < props.width / 3) {
			console.log('you should resize background');
		}*/
	}

	const buildBtn = (key: number, elt: btnReference) => {
		if (props.type === 'farmer') {
			return (
				<IconButton
					key={key}
					sx={{ 
						position: 'absolute',
						top: elt.top,
						left: elt.left,
					}}
					onClick={() => props.onLaunchActivity && props.onLaunchActivity(props.tokenMintable[key])}
					>
					<Tooltip title={nameTypeToken[props.tokenMintable[key]] ? nameTypeToken[props.tokenMintable[key]].name : 'Unknown'} placement="top-start">
						<Avatar sx={{ 
							height: '60px',
							width: '60px',
							border: '1px solid #666',
							background: '#faf8ebe6'
						}}>
							<Box 
								className={"nftTokenMin minType"+ unPad(props.tokenMintable[key])}
							></Box>
						</Avatar>
					</Tooltip>
				</IconButton>
			);
		}

		return (
			<Button
				key={key}
				sx={{ 
					position: 'absolute',
					top: elt.top,
					left: elt.left,
					fontSize: 20,
					borderRadius: 4,
				}}
				className="btnActivity"
				onClick={
					() => props.onLaunchActivity 
						&& props.onLaunchActivity(
							elt.type ? elt.type :
							props.tokenMintable[key] ? props.tokenMintable[key] : key
						)}
				>
				{elt.text}
			</Button>
		);
	}

	useEffect(() => {
		calculateSize();
	}, []);

	useEffect(() => {
		if (!imgWidth || !imgHeight) return ;
		calculateSplit();
	}, [imgHeight]);

	useEffect(() => {
		if (!nbBlock) return ;
		setLoading(false);
	}, [nbBlock]);

	const buildArray = (size: number) => Array.apply(null, Array(size)).map(function (x:number, i:number) { return i; })
	const btnList = dictionnaryBtnType[props.type];

	const fullRender = (
		<div
			className={"background_" + props.type}
			style={{
				backgroundPosition: '0 0',
				backgroundSize: imgWidth + 'px ' + imgHeight + 'px',
				height: imgHeight + 'px',
				width: imgWidth + 'px',
				display: 'block',
				margin: 'auto',
				position: 'relative',
			}}
		>
			{btnList.map((elt, index) => buildBtn(index, elt))}
			{props.children}
		</div>
	);

	return (
		<div style={{ height: '100vh', position: 'relative' }}>
			{(loading || props.loading) && <div style={{
				position: 'absolute',
				zIndex: 1,
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				background: '#00000096',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
					<CircularProgress sx={{ 
						position: 'relative',
						bottom: '80px',
						display: 'block',
						margin: 'auto',
						color: "white" }} />
				</div>}
			{nbBlock > 1 && <Carousel
				showThumbs={false}
				emulateTouch
			>
				{buildArray(nbBlock).map(
						(e:number, i:number) => 
							<div
								key={i}
								className={"background_" + props.type} 
								style={{
									width: props.width,
									backgroundRepeat: 'no-repeat',
									backgroundPosition: (i * props.width > 0 ? -1 * i * props.width + backgroundPadding : 0) + 'px 0',
									backgroundSize: imgWidth + 'px ' + imgHeight + 'px',
									height: imgHeight + 'px',
									//width: imgWidth + 'px',
								}}
								>
								{translatorPosition(i, props.width, props.type)
									.map((elt, index) => buildBtn(index, elt)
								)}
								{props.children}
							</div>
					)
				}
			</Carousel>}
			{!loading && nbBlock === 1 && fullRender}
		</div>
	);
}

export default ActivityDisplay;