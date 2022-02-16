import Button from "../../../Button";

const ButtonFooter = ({
  text,
  handleClick,
  stylesButton,
}) => {
  return (
    <Button
      type="button"
      handleClick={handleClick}
      stylesButton={stylesButton}
    >
      {text}
    </Button>
  );
}

export default ButtonFooter;
