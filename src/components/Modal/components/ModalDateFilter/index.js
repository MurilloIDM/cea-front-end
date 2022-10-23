import Modal from "../..";
import {DatePicker} from "antd"
import moment from "moment"
// import styles from "./styles.module.css";

const ModalDateFilter = ({title, buttons, visible, onCloseModal }) => {

  const {RangePicker} = DatePicker;

  return(
    <Modal
    title={title}
    buttons={buttons}
    visible={visible}
    onCloseModal={onCloseModal}
    >
      
    <RangePicker
    showTime
    size="large"
    format="DD/MM/YYYY"
    allowClear = "true"
    showToday = "true"
    allowEmpty = "true"
   
    // onChange={handleExpirationDate} 
  />
    </Modal>
  )
}
export default ModalDateFilter;