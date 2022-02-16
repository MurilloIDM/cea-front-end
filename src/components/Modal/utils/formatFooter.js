import ButtonFooter from "../components/ButtonFooter";

export const formatFooter = (buttons) => {
  const buttonsFooter = [];

  buttons && buttons.forEach((button) => {
    if (button.text) {
      buttonsFooter.push(
        <ButtonFooter
          text={button.text}
          stylesButton={button.styles}
          handleClick={button.handleClick}
        />
      );
    }
  });

  return buttonsFooter;
}
