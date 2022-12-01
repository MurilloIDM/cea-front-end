import Button from "../../../Button";

const ButtonFooter = ({
  text,
  handleClick,
  stylesButton,
  disabled,
}) => {
  return (
    <Button
      type="button"
      handleClick={handleClick}
      stylesButton={stylesButton}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}

export default ButtonFooter;
