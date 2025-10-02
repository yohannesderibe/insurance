import { InputBase, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';

interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  errorText?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Enter your password',
  errorText,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor="password" className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <InputBase
        id="password"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <LockOutlinedIcon sx={{ color: '#9CA3AF', mr: 1 }} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end"    tabIndex={-1}
    sx={{ p: 0.5 }}
    >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      sx={{
  width: '100%',
  maxWidth: '100%',
  height: '48px',
  border: '1px solid #FBBF24', // bright yellow border
  borderRadius: '8px',
  px: 2,
  fontSize: '0.875rem',
  color: '#000',
  backgroundColor: '#fff',
  '& input::placeholder': {
    color: '#9CA3AF',
    opacity: 1,
  },
  '&:focus-within': {
    boxShadow: '0px 0px 0px 4px rgba(251, 191, 36, 0.25)', // yellow focus glow
    borderColor: '#FBBF24', // keep yellow when focused
  },
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
}}

      />
      {errorText && (
        <p className="text-sm text-red-600 mt-1">{errorText}</p>
      )}
    </div>
  );
};

export default PasswordField;
