import { InputBase, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  errorText?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  label = 'Email',
  placeholder = 'you@email.com',
  errorText,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor="email" className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <InputBase
        id="email"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <MailOutlineIcon sx={{ color: '#9CA3AF', marginRight: '0.25rem' }} />
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

export default EmailField;
 