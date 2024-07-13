import PropTypes from 'prop-types';
import './InputField.css';

const InputField = ({
  label,
  type,
  value,
  onChange,
  required = false
}) => {
  return (
    <div className="input-field">
      <label className="input-label">
        {label}
      </label>
      <input
        className="input-element"
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool
};

export default InputField;
