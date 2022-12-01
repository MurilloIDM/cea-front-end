import { Modal as ModalAntd } from "antd";

import { formatFooter } from "./utils/formatFooter";

import "./styles.less";

const Modal = ({
  title,
  visible,
  buttons,
  children,
  onCloseModal,
<<<<<<< HEAD
  style
=======
  bodyStyle,
  style,
  width
>>>>>>> fd403fcd4215ab261e95320a5b39a834633734ef
}) => {

  const footerButtons = formatFooter(buttons);

  return (
    <ModalAntd
      title={title}
      visible={visible}
      destroyOnClose={true}
      footer={footerButtons}
      onCancel={onCloseModal}
<<<<<<< HEAD
      style={style}
=======
      width={width}
      style={style}
      bodyStyle={bodyStyle}
>>>>>>> fd403fcd4215ab261e95320a5b39a834633734ef
    >
      <div className="content-modal">
        {children}
      </div>
    </ModalAntd>
  );
}

export default Modal;
