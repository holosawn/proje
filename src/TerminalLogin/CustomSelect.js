import React from 'react';
import { TextField,MenuItem,Box,InputLabel } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const SelectWrapper = ({
  name,
  options,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = evt => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined',
    fullWidth: true,
    onChange: handleChange
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }


  return (  
        <TextField {...configSelect}>
        {Object.keys(options).map((pos) => {
            return (
            <MenuItem key={pos} value={options[pos]}>
                {options[pos]}
            </MenuItem>
            )
        })}
        </TextField>
  );
};

export default SelectWrapper;