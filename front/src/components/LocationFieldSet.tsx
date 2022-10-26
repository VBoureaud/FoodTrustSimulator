import React, { useState, useEffect } from 'react'

import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

type LocationFieldsetProps = {
  onChange?: Function;
  url?: string;
  background?: string;
  defaultValue?: City;
};

type ValueMemoization = {
  [x: string]: City[];
};

interface City {
  name: string;
  country?: string;
  lat?: string;
  lng?: string;
  index?: string;
  id?: string;
}
const LocationFieldSet : React.FunctionComponent<LocationFieldsetProps> = (props) => {
  const [options, setOptions] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [valueMemoization, setValueMemoization] = useState<Partial<ValueMemoization>>({});

  useEffect(() => {
    if (props.url && inputValue) {
      (async () => {
        const data = await fetchCities();
        setOptions(data);
        setLoading(false);
      })();
    }
  }, [inputValue]);
  
  useEffect(() => {
    if (!open) {
      setOptions([]);
      setLoading(false);
    }
  }, [open]);

  const fetchCities = async () => {
    if (!valueMemoization[inputValue]) {
      const data = await fetch(props.url + inputValue, {
        method: 'GET',
      }).then((response) => response.json())
      .then((response) => {
        if (!response) throw new Error("Request Fail");
        else if (response.code) {
          throw new Error(response.message);
        }
        const data = response.cities.results.map(
          (elt: City, index: number) => ({
            ...elt,
            index,
          }));
        valueMemoization[inputValue] = data;
        setValueMemoization(valueMemoization);
        return data;
      });
      return data;
    }
    return valueMemoization[inputValue];
  }

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={props.defaultValue}
      filterOptions={x => x}//To search as you type
      getOptionLabel={(option: City) => option.index + ' ' + option.name + ' (' + option.country + ')'}
      id="autocomplete-location"
      options={options}
      loading={loading}
      onChange={(event: any, newValue: City | null) => {
        if (props.onChange) props.onChange(newValue);
      }}
      onInputChange={(event: any, newValue: string | null) => {
        setInputValue(newValue);
      }}
      sx={{ 
        minWidth: '235px',
        background: props.background ? props.background : "#363636",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}

export default LocationFieldSet;