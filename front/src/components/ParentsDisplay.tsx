import React from 'react';
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Tree, TreeNode } from 'react-organizational-chart';
import CircularProgress from "@mui/material/CircularProgress";

import '@utils/TypeToken.less';
import {
	translateImageSpecsToCss,
	nameTypeToken,
} from "@utils/gameEngine";
import { 
	unPad,
} from "@utils/helpers";
import { 
	Parents
} from '@store/types/NftTypes';

const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

const Token = (props: { tokenType: string; }) => {
	const image = props.tokenType.split('#')[0];
	return (
		<Tooltip title={capitalize(nameTypeToken[image].name)} placement="top-start">
			<Box 
				style={{ 
					margin: 'auto',
					filter: translateImageSpecsToCss(props.tokenType),
					WebkitFilter: translateImageSpecsToCss(props.tokenType),
				}}
				className={"nftTokenMiddle middleType" 
					+ unPad(image) }
			></Box>
		</Tooltip>
	);
}

const RecursiveTree = (props: Parents) => {
  const hasChildren = props.children && props.children.length

  if (!hasChildren) {
  	return (<TreeNode label={
    <Link to={ '/nft/' + props.elt.uri.name }>
    	<Token tokenType={props.elt.uri.image} />
    </Link>} />);
  }
  return (<TreeNode label={
    <Link to={ '/nft/' + props.elt.uri.name }>
    	<Token tokenType={props.elt.uri.image} />
    </Link>}> 
      {props.children.map((e: Parents) => (
        <RecursiveTree key={e.elt.uri.name} {...e} />
      ))}
    </TreeNode>);
}

type ParentsDisplayProps = {
	loading: boolean;
	parents: Parents;
};

const ParentsDisplay = (props: ParentsDisplayProps) => {
	return <Box sx={{ textAlign: 'center' }}>
		{props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}

		{!props.loading && props.parents && <Tree
			lineWidth={'2px'}
			lineColor={'#6ef1ff'}
			lineBorderRadius={'10px'}
			label={<Typography sx={{ fontSize: '22px', marginBottom: '15px' }}>Family Tree</Typography>}
		>
			<RecursiveTree
				{...props.parents}
			/>
		</Tree>}
	</Box>;
}

export default ParentsDisplay;
