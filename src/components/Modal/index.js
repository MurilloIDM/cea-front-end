import { Modal as ModalAntd } from "antd";

import "./styles.less";
import { formatFooter } from "./utils/formatFooter";

const Modal = ({
  visible,
  buttons,
  children,
  onCloseModal,
}) => {

  const footerButtons = formatFooter(buttons);

  return (
    <ModalAntd
      centered
      visible={visible}
      destroyOnClose={true}
      footer={footerButtons}
      onCancel={onCloseModal}
    >
      <div className="content-modal">
        {children}
      </div>
    </ModalAntd>
  );
}

export default Modal;
