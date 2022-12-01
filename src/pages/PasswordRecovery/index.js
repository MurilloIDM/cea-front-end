import { useContext, useEffect, useState } from "react";
import { Form, Input, Alert, Spin } from "antd";
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined, LockOutlined } from "@ant-design/icons";

import Button from "../../components/Button";

import useStore from "../../hooks/useStore";
import { Context } from "../../context/AuthContext";

import { AdministratorService } from "../../services";

import logo from "../../images/logo.png";

import styles from "./styles.module.css";

const { Item } = Form;

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const { validateSession, handleLogout } = useContext(Context);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDiffPassword, setErrorDiffPassword] = useState(false);

  useEffect(() => {
    validateSession();
  }, []);

  const validateRepeteKey = (values) => values.password != values.repetePassword;

  const onFinish = async (values) => {
    const isValidPassword = validateRepeteKey(values);

    if (isValidPassword) {
      setErrorDiffPassword(true);
      return;
    }

    const { getDataLocalStorage } = useStore();
    const username = getDataLocalStorage("user")?.username;

    const payload = {
      username,
      password: values?.password,
    };

    setLoading(true);
    try {
      await AdministratorService.createPassword(payload);
      setLoading(false);

      handleLogout();
      navigate("/");
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setErrorDiffPassword(false);
  }

  const loadingIcon = <LoadingOutlined className={styles.loadingIcon} spin />;

  return (
    <div className={styles.container}>
      <img src={logo} alt="logo"/>
      <h1>Painel Administrativo Comunidade Mães de Impacto</h1>

      <Alert
        className={styles.alert}
        message="Sua senha atualmente é temporária! Crie uma nova senha de acesso."
      />

      {error && (
        <div id="alert-error-auth">
          <Alert
            message="Falha na atualização de senha!"
            description="Cadastro de senha inválido! Tente novamente mais tarde."
            type="error"
            showIcon
            closable
          />
        </div>
      )}

      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        name="form-password-recovery"
      >
        <Item
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor, insira a nova senha."
            },
            {
              pattern: /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
              message: "A senha deve possuir no mínimo 8 caracteres com letras maiúsculas e minúsculas, números e" +
                " caracteres como ($*&@#)."
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined/>}
            placeholder="Digite a nova senha"
          />
        </Item>

        <Item
          style={{ marginBottom: 0 }}
          name="repetePassword"
          rules={[
            {
              required: true,
              message: "Por favor, repita a nova senha."
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined/>}
            placeholder="Digite a nova senha novamente"
          />
        </Item>

        <div className={styles.errorDiffPassword}>
          {errorDiffPassword && (
            <p>As senhas não correspondem. Elas devem ser iguais, digite-a novamente!</p>
          )}
        </div>

        <Button
          type="submit"
          stylesButton={`buttonPrimary ${styles.buttonSubmit}`}
        >
          {loading ? (<Spin indicator={loadingIcon} />) : "Salvar"}
        </Button>
      </Form>
    </div>
  );
}

export default PasswordRecovery;