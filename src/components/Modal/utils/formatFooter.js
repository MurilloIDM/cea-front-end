import ButtonFooter from "../components/ButtonFooter";

export const formatFooter = (buttons) => {
  const buttonsFooter = [];

  buttons && buttons.forEach((button, index) => {
    if (button.text) {
      buttonsFooter.push(
        <ButtonFooter
          key={index}
          text={button.text}
          stylesButton={button.styles}
          handleClick={button.handleClick}
          disabled={button.disabled !== undefined ? button.disabled : false}
        />
      );
    }
  });

  return buttonsFooter;
}
