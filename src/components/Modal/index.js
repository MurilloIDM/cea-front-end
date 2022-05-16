import { Modal as ModalAntd } from "antd";

import { formatFooter } from "./utils/formatFooter";

import "./styles.less";

const Modal = ({
  title,
  visible,
  buttons,
  children,
  onCloseModal,
}) => {

  const footerButtons = formatFooter(buttons);

  return (
    <ModalAntd
      title={title}
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
