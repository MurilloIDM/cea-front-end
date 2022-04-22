import { Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import logo from "../../images/logo.png";

import Button from "../../components/Button";

import { useNavigate } from 'react-router-dom';

import styles from "./styles.module.css";

const { Item } = Form;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Success:', values);
    navigate("/recuperacao-senha");
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={styles.container}>
      <img src={logo} alt="logo" />
      <h1>Painel Administrativo Comunidade Mães de Impacto</h1>

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
          name="username"
          rules={[
            {
              required: true,
              message: 'Por favor, insira seu login!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Login" />
        </Item>

        <Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Por favor, insira sua senha!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Senha" />
        </Item>

        <Button
          type="submit"
          stylesButton={`buttonPrimary ${styles.buttonSubmit}`}
        >
          Entrar
        </Button>
      </Form>
    </div>
  );
}

export default Login;
