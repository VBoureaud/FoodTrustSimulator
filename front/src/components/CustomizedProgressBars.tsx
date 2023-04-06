import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';

type CustomizedProgressBarsProps = {
  progress: number;
  showValue?: number | string;
  colorGraduation?: boolean;
  forcedColor?: string;
};

const chooseColors = (progress: number, colorGraduation: boolean) => {
  if (colorGraduation && progress <= 30)
    return 'tomato';
  else if (colorGraduation && progress <= 50)
    return 'yellow';
  return '#1a90ff';
}

const CustomizedProgressBars = (props: CustomizedProgressBarsProps) => {
  const progress = <LinearProgress
    sx={{
      height: 10,
      width: '100%',
      borderRadius: 5,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#333',
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: props.forcedColor ? props.forcedColor : chooseColors(props.progress, !!props.colorGraduation),
      },
    }}
    variant="determinate"
    value={props.progress}
  />;
  return props.showValue !== undefined ? <Tooltip 
    placement="bottom"
    title={props.showValue}>
      {progress}
    </Tooltip> : progress;
}
 

export default CustomizedProgressBars;