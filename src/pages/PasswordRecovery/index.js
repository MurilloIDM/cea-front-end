import { Form, Input, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons'

import logo from "../../images/logo.png";

import Button from "../../components/Button";

import { useNavigate } from 'react-router-dom';

import styles from "./styles.module.css";

const { Item } = Form;


function validateRepeteKey (values) {
  // console.log('Success:', values);
  const errorRepeteKey = {};
  if (values.newPassword != values.repeteNewPassword)
  errorRepeteKey.repeteNewPassword = "As senhas devem ser iguais, digite-a novamente.";
  console.log(errorRepeteKey.repeteNewPassword);

  return errorRepeteKey;
}
const PasswordRecovery = () => {
  const errorRepeteKey = {
    // repeteNewPassword: "As senhas devem ser iguais, digite-a novamente."
  }
  const navigate = useNavigate();

  const onFinish = (values) => {
    // console.log('Success:', values);
    
    validateRepeteKey(values);
    console.log(errorRepeteKey);

    if (errorRepeteKey.repeteNewPassword != "As senhas devem ser iguais, digite-a novamente."){
      console.log('Success:', values);
      // navigate("/leads/listagem");
    }
    else {
      console.log('Error:', values);
      console.log(errorRepeteKey.repetePassword);
  
  }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={styles.container}>
      <img src={logo} alt="logo" />
      <h1>Painel Administrativo Comunidade Mães de Impacto</h1>

      <Alert className={styles.alert} message="Sua senha atualmente é temporária! Crie uma nova senha de acesso." />

      <Form

        initialValues={{
          remember: true,

        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        name="form-auth"
      >

        <Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Digite uma nova senha"
            },
            //rever validação
            // {
            //   pattern: /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[$&@#])(?:([0-9a-zA-Z$&@#])(?!\1)){8,}$/,
            //   message: "tulio invalido"
            // }

          ]}
        >

          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Digite a nova senha" />
        </Item>

        <Item
          name="repeteNewPassword"
          rules={[
            {
              required: true,
              message: "Repita a nova senha"
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Digite a nova senha novamente" />
          
          {/* <div>
            {errorRepeteKey.repetePassword && <span className="">{errorRepeteKey.repetePassword}</span>}
          </div> */}
        </Item>

        <Button
          type="submit"
          stylesButton={`buttonPrimary ${styles.buttonSubmit}`}
        >
          Salvar
        </Button>
      </Form>
    </div >
  );
}

export default PasswordRecovery;