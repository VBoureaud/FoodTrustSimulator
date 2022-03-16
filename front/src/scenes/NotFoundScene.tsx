import React from 'react';

import Template from "@components/Template";
import Typography from '@mui/material/Typography';

type NotFoundProps = {};
const NotFoundScene : React.FunctionComponent<NotFoundProps> = () => {
	return (
		<Template isLogged={false}>
			<Typography variant="h2" sx={{ color: 'black' }}>Page not found</Typography>
		</Template>
	);
}

export default NotFoundScene;