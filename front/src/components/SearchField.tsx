import * as React from 'react';

import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 0,
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '4px',
  backgroundColor: '#525d6c',
  '&:hover': {
    backgroundColor: '#525d6c',
  },
  marginLeft: 0,
  marginRight: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    borderRadius: '4px',
    /*[theme.breakpoints.up('md')]: {
      width: '20ch',
    },*/
  },
}));

type SearchFieldProps = {
  onChange?: Function;
  onDelete?: Function;
  value?: string;
  loading?: boolean;
};

const SearchField : React.FunctionComponent<SearchFieldProps> = (props) => {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  let timeout: ReturnType<typeof setTimeout>;

  React.useEffect(() => {
    setValue(props.value);
  }, []);

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  React.useEffect(() => {
    if (timeout) clearTimeout(timeout);
    setLoading(true);
    timeout = setTimeout(() => {
      if (props.onChange) props.onChange(value);
      setLoading(false);
    }, 1500);

    // like componentDidUnMount
    return () => clearTimeout(timeout);
  }, [value]);


  const handleChange = (e: { target: { value: string; }; }) => {
    setValue(e.target.value);
  }

  const handleDelete = () => {
    if (props.onDelete) {
      if (timeout) clearTimeout(timeout);
      props.onDelete();
      setValue('');
    }
  }

  return (
		<Search sx={{ maxWidth: '100%', pr: '0 10px' }}>
			<SearchIconWrapper>
			 	<SearchIcon />
			</SearchIconWrapper>
			<StyledInputBase
        value={value}
		  	placeholder="Search…"
		  	inputProps={{ 'aria-label': 'search' }}
        onChange={handleChange}
			/>
      {(props.loading || loading) && <Box sx={{ display: 'flex', justifyContent: 'center', padding: '5px', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ 
            color: "yellow",
            position: "relative",
            bottom: '2px',
          }} />
        </Box>}
      {value && <Button sx={{ m: 0, color: 'white', minWidth: 'fit-content' }} onClick={handleDelete}>
        <DeleteIcon />
      </Button>}
		</Search>
	);
}

export default SearchField;