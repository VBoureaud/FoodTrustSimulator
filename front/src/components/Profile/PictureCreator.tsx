import * as React from 'react';
import FaceIcon from '@mui/icons-material/Face';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const buildArray = (size: number) => Array.apply(null, Array(size)).map(function (x:number, i:number) { return i; })
import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import './profile.less';

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

type PictureCreatorProps = {
	imageDisplay?: string;
	mode?: number;
	cropSize?: boolean;
	onConfirm?: Function;
	level?: number;
	name?: string;
	type?: string;
	location?: string;
	onClick?: Function;
	actionText?: string;
};

export const PictureCreator = (props: PictureCreatorProps) => {
	const [activeTool, setActiveTool] = React.useState(0);
	const [activeToolCached, setActiveToolCached] = React.useState(0);
	const tools = [
		{ elt: "IconePeau", name: 'Skin' },
		{ elt: "IconeChapeau", name: 'Hat' },
		{ elt: "IconeSourcils", name: 'Eyebrow' },
		{ elt: "IconeNez", name: 'Nose' },
		{ elt: "IconeVisage", name: 'Face' },
		{ elt: "IconePantalon", name: 'Pants' },
		{ elt: "IconeChaussure", name: 'Shoes' },
		{ elt: "IconePull", name: 'Sweater' },
		{ elt: "IconeAccessoire", name: 'Accessory' },
		{ elt: "IconeSmile", name: 'Smile' },
	];
	
	const [skin, setSkin] = React.useState(0);
	const [chapeau, setChapeau] = React.useState(0);
	const [sourcil, setSourcil] = React.useState(0);
	const [nez, setNez] = React.useState(0);
	const [visage, setVisage] = React.useState(0);
	const [pantalon, setPantalon] = React.useState(0);
	const [chaussure, setChaussure] = React.useState(0);
	const [pull, setPull] = React.useState(0);
	const [accessoire, setAccessoire] = React.useState(0);
	const [smile, setSmile] = React.useState(0);
	const enumChoices = {
		skin: 0,
		chapeau: 1,
		sourcil: 2,
		nez: 3,
		visage: 4,
		pantalon: 5,
		chaussure: 6,
		pull: 7,
		accessoire: 8,
		smile: 9,
		readOnly: 10,
	};
	const enumMode = {
		displayOnly: 0,
		createMode: 1,
	};

	React.useEffect(() => {
		if (props.mode === enumMode.displayOnly) setActiveTool(enumChoices.readOnly);
		handleBuildImage(props.imageDisplay);
	}, []);

	React.useEffect(() => {
		handleBuildImage(props.imageDisplay);
	}, [props.imageDisplay]);

	const handleSmile = (image: string) => {
		if (!image) return ;
		const choicesStr = image.split('-');
		if (choicesStr.length != 10) return ;
		const choicesNum = choicesStr.map((x: string) => parseInt(x));
		setSmile(choicesNum[enumChoices.smile]);
	}

	const handlePreview = () => {
		if (activeTool === enumChoices.readOnly) {
			setActiveTool(activeToolCached);
		} else {
			setActiveToolCached(activeTool);
			setActiveTool(enumChoices.readOnly);
		}
	}

	const handleBuildImage = (image: string) => {
		if (!image) return ;
		const choicesStr = image.split('-');
		if (choicesStr.length != 10) return ;
		const choicesNum = choicesStr.map((x: string) => parseInt(x));

		setSkin(choicesNum[enumChoices.skin]);
		setChapeau(choicesNum[enumChoices.chapeau]);
		setSourcil(choicesNum[enumChoices.sourcil]);
		setNez(choicesNum[enumChoices.nez]);
		setVisage(choicesNum[enumChoices.visage]);
		setPantalon(choicesNum[enumChoices.pantalon]);
		setChaussure(choicesNum[enumChoices.chaussure]);
		setPull(choicesNum[enumChoices.pull]);
		setAccessoire(choicesNum[enumChoices.accessoire]);
		setSmile(choicesNum[enumChoices.smile]);
	}

	const handleChoiceList = () => {
		const stringifyChoice = skin + '-' 
			+ chapeau + '-'
			+ sourcil + '-'
			+ nez + '-'
			+ visage + '-'
			+ pantalon + '-'
			+ chaussure + '-'
			+ pull + '-'
			+ accessoire + '-'
			+ smile;
		if (props.onConfirm)
			props.onConfirm(stringifyChoice);
		return stringifyChoice;
	}

	return (
		<div style={{ maxWidth: '100%', display: 'flex', flexWrap: 'wrap' }}>
			{props.mode === enumMode.createMode && <div style={{ flex: 1, maxWidth: '425px', display: 'flex', flexDirection: 'column' }} className="persoBtnContainer">
				<Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>Toolbox</Typography>
				<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
					{tools.map((tool, index) => 
						<Tooltip title={tool.name} key={index} placement="top">
								<div
									className="btn"
									onClick={() => setActiveTool(index)}>
									<div className={"IconeCreation " + tool.elt + (index === activeTool ? ' active' : '')}></div>
							</div>
						</Tooltip>)}
				</div>
			</div>}
			<div
				className="persoContainer" 
				style={{ flex: 3, height: props.cropSize ? 'auto' : '600px' }}
				onClick={() => props.onClick && props.onClick()}>
				{props.level != null && <Box className="levelDisplay">
						<span style={{ display: 'block', fontSize: '14px' }}>LVL</span>
						<span>{props.level}</span>
					</Box>}
				{props.type != null && <Tooltip title={props.type} placement="top">
						<Box className="typeDisplay">
							<span className={"type_" + props.type}></span>
						</Box>
					</Tooltip>}
				<div
					onMouseOver={() => props.mode === enumMode.displayOnly && setSmile(10)}
					onMouseOut ={() => props.mode === enumMode.displayOnly && handleSmile(props.imageDisplay)}
					className="persoZone" style={{ height: props.cropSize ? '282px' : '100%' }}>					
					<div className="persoLine" style={{ top: props.cropSize ? '300px' : '0' }}></div>
					<div className="persoEmpty" style={{ top: props.cropSize ? '300px' : '0' }}></div>
					<div className="persoSlider" style={{ top: props.cropSize ? '300px' : '0' }}>
						
						{/* Skin */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setSkin(item)}
							className="carouselZone skin"
							emulateTouch={activeTool === enumChoices.skin}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.skin}
							showArrows={activeTool === enumChoices.skin}
							selectedItem={skin}
						>
							{buildArray(5).map((elt:number, index: number) =>
								<div
									key={index}
									className={"skin" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Smile Face - smile only when :hover + displayOnly */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setSmile(item)}
							className="carouselZone smileFace"
							emulateTouch={activeTool === enumChoices.smile}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.smile}
							showArrows={activeTool === enumChoices.smile}
							selectedItem={smile}
						>
							{buildArray(props.mode === enumMode.displayOnly ? 11 : 10).map((elt:number, index: number) =>
								<div
									key={index}
									className={"face" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Chapeau - zIndex Top if not editable */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setChapeau(item)}
							className={activeTool === enumChoices.readOnly ?
								"carouselZone chapeau persoSliderTop"
								: activeTool === enumChoices.chapeau 
									? "carouselZone chapeau persoSliderTop" 
									: "carouselZone chapeau"}
							emulateTouch={activeTool === enumChoices.chapeau}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.chapeau}
							showArrows={activeTool === enumChoices.chapeau}
							selectedItem={chapeau}
						>
							{buildArray(8).map((elt:number, index: number) =>
								<div
									key={index}
									className={"chapeau" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Sourcil */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setSourcil(item)}
							className="carouselZone sourcil"
							emulateTouch={activeTool === enumChoices.sourcil}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.sourcil}
							showArrows={activeTool === enumChoices.sourcil}
							selectedItem={sourcil}
						>
							{buildArray(6).map((elt:number, index: number) =>
								<div
									key={index}
									className={"sourcil" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Nez */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setNez(item)}
							className="carouselZone nez"
							emulateTouch={activeTool === enumChoices.nez}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.nez}
							showArrows={activeTool === enumChoices.nez}
							selectedItem={nez}
						>
							{buildArray(6).map((elt:number, index: number) =>
								<div
									key={index}
									className={"nez" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Object on Face - zIndex Top if not editable */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setVisage(item)}
							className={activeTool === enumChoices.readOnly ? 
								"carouselZone objectFace persoSliderTop"
								: activeTool === enumChoices.visage 
									? "carouselZone objectFace persoSliderTop" 
									: "carouselZone objectFace"}
							emulateTouch={activeTool === enumChoices.visage}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.visage}
							showArrows={activeTool === enumChoices.visage}
							selectedItem={visage}
						>
							{buildArray(7).map((elt:number, index: number) =>
								<div
									key={index}
									className={"object_face_" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Pantalon - zIndex Top if not editable */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setPantalon(item)}
							className={activeTool === enumChoices.readOnly ? 
								"carouselZone pantalon persoSliderTop"
								: activeTool === enumChoices.pantalon 
									? "carouselZone pantalon persoSliderTop" 
									: "carouselZone pantalon"}
							emulateTouch={activeTool === enumChoices.pantalon}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.pantalon}
							showArrows={activeTool === enumChoices.pantalon}
							selectedItem={pantalon}
						>
							{buildArray(4).map((elt:number, index: number) =>
								<div
									key={index}
									className={"pantalon" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Chaussure - zIndex Top if not editable */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setChaussure(item)}
							className={activeTool === enumChoices.readOnly ? 
								"carouselZone chaussure persoSliderTop"
								: activeTool === enumChoices.chaussure 
									? "carouselZone chaussure persoSliderTop" 
									: "carouselZone chaussure"}
							emulateTouch={activeTool === enumChoices.chaussure}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.chaussure}
							showArrows={activeTool === enumChoices.chaussure}
							selectedItem={chaussure}
						>
							{buildArray(4).map((elt:number, index: number) =>
								<div
									key={index}
									className={"chaussure" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Pull - zIndex Top if not editable */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setPull(item)}
							className={activeTool === enumChoices.readOnly ? 
								"carouselZone pull persoSliderTop"
								: activeTool === enumChoices.pull 
									? "carouselZone pull persoSliderTop" 
									: "carouselZone pull"}
							emulateTouch={activeTool === enumChoices.pull}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.pull}
							showArrows={activeTool === enumChoices.pull}
							selectedItem={pull}
						>
							{buildArray(4).map((elt:number, index: number) =>
								<div
									key={index}
									className={"pull" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

						{/* Pull_Accessoire - zIndex Top if not editable */}
						<Carousel
							showThumbs={false}
							transitionTime={props.mode === enumMode.displayOnly ? 0 : 400}
							onChange={(item) => setAccessoire(item)}
							className={activeTool === enumChoices.readOnly ? 
								"carouselZone pullAccessoire persoSliderTop"
								: activeTool === enumChoices.accessoire 
									? "carouselZone pullAccessoire persoSliderTop" 
									: "carouselZone pullAccessoire"}
							emulateTouch={activeTool === enumChoices.accessoire}
							infiniteLoop
							showStatus={false}
							showIndicators={false}
							swipeable={activeTool === enumChoices.accessoire}
							showArrows={activeTool === enumChoices.accessoire}
							selectedItem={accessoire}
						>
							{buildArray(5).map((elt:number, index: number) =>
								<div
									key={index}
									className={"pullAccessoire" + (index + 1)}
									style={{
										backgroundPosition: 17 + (-1 * (266.5 * index)) + 'px 0px',
									}}>
								</div>
							)}
						</Carousel>

					</div>
				</div>
				{props.name && props.location && <>
					<Divider sx={{ background: '#dfdddd', mb: 2 }} />
					<Box className="descriptionPerso">
						<Typography variant='h5' sx={{ mb: 0, color: 'black' }}><AccountCircleIcon sx={{ position: 'relative', top: '3px', color: '#343434' }}/> {capitalize(props.name)}</Typography>
						<Typography variant='h6' sx={{ mb: 1, color: 'black' }}><MyLocationIcon sx={{ position: 'relative', top: '3px', color: '#343434' }}/> {capitalize(props.location)}</Typography>
					</Box>
				</>}
				{props.actionText 
					&& <Button sx={{ width: '100%' }}>
						{props.actionText}
					</Button>}
			</div>
			{props.mode === enumMode.createMode && <div style={{ flex: 1, margin: '20px 15px', display: 'flex', alignItems: 'center' }}>
				<Box>
						<div 
							onMouseOver={() => handlePreview()}
							onMouseOut ={() => handlePreview()}
							style={{ 
								color: 'white',
								background: 'rgb(54, 66, 84)',
								margin: 'auto',
								padding: '7px 10px',
								borderRadius: '6px',
								textAlign: 'center',
								marginBottom: '5px',
								cursor: 'pointer',
							}}>
							PREVIEW
					</div>
					<Button variant="contained" color="success" sx={{ padding: '8px 40px', color: 'white' }} onClick={handleChoiceList}>Confirm</Button>
				</Box>
			</div>}
		</div>
	);
}