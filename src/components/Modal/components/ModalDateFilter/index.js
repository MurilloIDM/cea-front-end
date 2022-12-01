import { DatePicker } from "antd"
import Modal from "../..";
import ButtonAction from "../..";

const ModalDateFilter = ({ title, buttons, visible, onCloseModal, iconButton, textButton, stylesButton, type, actionButton, onClick, onChange, bottomLeft}) => {

  const { RangePicker } = DatePicker;

  return (
    

    <Modal
      title={title}
      buttons={buttons}
      visible={visible}
      onCloseModal={onCloseModal}
      style={{
        top: 20,
      }}
    >
<div>
      <RangePicker
        showTime
        size="large"
        format="DD/MM/YYYY"
        allowClear="true"
        showToday="true"
        allowEmpty="true"
        onChange={onChange}
        placement={bottomLeft}
      />
      <ButtonAction
        type={type}
        iconButton={iconButton}
        textButton={textButton}
        actionButton={actionButton}
        stylesButton={stylesButton}
        onClick={onClick}
      />
      </div>
    </Modal>
  )
}
export default ModalDateFilter;