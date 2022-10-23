const Button = ({ type, children, stylesButton, onClick, disabled }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`button ${stylesButton}`}
    >
      {children}
    </button>
  );
}

export default Button;
