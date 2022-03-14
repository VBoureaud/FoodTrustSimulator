import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

type SelectFieldProps = {
  onChange?: Function;
  options: string[];
  defaultValue: string;
};

const SelectField : React.FunctionComponent<SelectFieldProps> = (props) => {
  const handleChange = (e: { target: { value: string; }; }) => {
    if (props.onChange)
      props.onChange(e.target.value);
  }

  return (
    <Box sx={{ minWidth: 120, background: '#525d6c', padding: '3px 10px' }}>
      <FormControl fullWidth>
        <NativeSelect
          defaultValue={props.defaultValue}
          onChange={handleChange}
        >
          {props.options && props.options.map((e, i) => 
            <option key={i} value={e}>{e.replace(/^\w/, c => c.toUpperCase())}</option>
          )};
        </NativeSelect>
      </FormControl>
    </Box>
  );
}

export default SelectField;