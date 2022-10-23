import Button from "../../Button";
import ButtonCSV from "../../ButtonCSV";

const ButtonAction = ({
  type,
  iconButton,
  textButton,
  actionButton,
  stylesButton,
  onClick
}) => {
  if (type === "export") {
    return (
      <ButtonCSV
        iconButton={iconButton}
        textButton={`${textButton}`}
        stylesButton={stylesButton}
      />
    );
  }

  return (
    <Button
      type={type}
      handleClick={actionButton}
      stylesButton={stylesButton}
      onClick={onClick}
    >
      {iconButton}
      {` ${textButton}`}
    </Button>
  );
}

export default ButtonAction;