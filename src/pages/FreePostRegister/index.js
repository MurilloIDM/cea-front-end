import { createRef, useEffect, useState } from "react";
import { Form, Input, PageHeader, Switch, Alert } from "antd";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ImportOutlined, SaveOutlined } from "@ant-design/icons"

import Button from "../../components/Button";
import Loader from "../../components/Loader";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import ModalError from "../../components/Modal/components/ModalError";
import ModalSuccess from "../../components/Modal/components/ModalSuccess";

import { formatRoutes } from "./utils/formatRoutes";

import useStore from "../../hooks/useStore";

import { FreepostService } from "../../services";

import styles from "./styles.module.css";

const { TextArea } = Input;
const { Item } = Form;

const FreePostRegister = ({ isEdit }) => {
  const { id } = useParams();
  const refForm = createRef();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [imgUrl, setImgUrl] = useState('');
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imgUrlOk, setImgUrlOk] = useState(true);
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [initialValues, setInitialValues] = useState(false);

  useEffect(() => {
    if (isEdit && !initialValues) {
      const { record: freePost } = state;
      setStatus(freePost.status === "online" ? true : false);
      setImgUrl(freePost.imageUrl);

      form.setFieldsValue({
        title: freePost.title,
        description: freePost.description,
        imageUrl: freePost.imageUrl,
        status: freePost.status
      });

      setInitialValues(true);
    }
  }, [isEdit, initialValues, id, form, status, state]);

  useEffect(() => {
    return () => {
      form.resetFields();
      setInitialValues(false);
    }
  }, [form]);

  const titleScreen = !isEdit ? "Cadastro de Conte??do Gratuito" : "Edi????o de Conte??do Gratuito";
  const routes = formatRoutes(isEdit);


  const handleCloseModalSuccess = () => {
    setModalSuccess(false);
    if (isEdit) navigate("/conteudo-gratuito/listagem");
    setImgUrl('');
  };

  const handleCloseModalError = () => setModalError(false);


  const onSubmit = async (values) => {
    const { getDataLocalStorage } = useStore();
    const usernameAdmin = getDataLocalStorage("user")?.username;

    const payload = {
      title: values?.title,
      description: values?.description,
      imageUrl: values?.imageUrl,
      status,
      user: usernameAdmin,
    };

    try {
      setLoading(true);
      const idUpdate = isEdit ? id : null;
      const operation = isEdit ? FreepostService.update : FreepostService.create;
      await operation(payload, idUpdate);

      setModalSuccess(true);

      form.resetFields();
      setImgUrl('');
      setStatus(true);
      setImgUrlOk(true);
    } catch (e) {
      const status = e?.request?.status;

      if (status === 400) {
        setMessageError(e?.response?.data?.message);
      }
      setModalError(true);
    } finally {
      setLoading(false);
    }
  }

  const handleBlur = (e) => {
    setImgUrl(e.target.value);
    setImgUrlOk(true);
  }

  const handleSwitchStatus = () => {
    setStatus(!status);
  }

  const handleImgUrlError = () => {
    setImgUrlOk(false);
    setImgUrl('');
  }

  return (
    <div>
      <Loader loading={loading} />

      <PageHeader
        title={titleScreen}
        breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
      />

      <div className={styles.containerForm}>
        <Form
          form={form}
          ref={refForm}
          onFinish={onSubmit}
          name="create-freepost-form"
        >
          <Item
            required
            name="title"
            label="T??tulo"
            rules={[{ required: true, message: "Campo obrigat??rio! Preencha corretamente!" }]}
          >
            <Input
              placeholder="Digite um t??tulo"
            />
          </Item>

          <Item
            required
            name="description"
            label="Descri????o"
            rules={[{ required: true, message: "Campo obrigat??rio! Preencha corretamente!" }]}
          >
            <TextArea
              placeholder="Descri????o do conte??do gratuito"
              rows={4}
              showCount
              maxLength={2000}
            />
          </Item>

          <Item
            required
            name="imageUrl"
            label="URL da imagem"
            rules={
              [
                { required: true, message: "Campo obrigat??rio! Preencha corretamente!" },
                { type: 'url', message: "O caminho inserido n??o ?? uma URL v??lida" }
              ]}
          >

            <Input
              placeholder="Informe a URL da imagem (Propor????o preferencial: 500x145)"
              onBlur={handleBlur}
            />
          </Item>

          {
            imgUrlOk ? imgUrl ?
              <div className={styles.previewImg}>
                <img src={imgUrl} alt="Preview da Imagem" onError={handleImgUrlError} />
              </div>
              :
              <div className={styles.previewImg}>Preview da Imagem</div> :
              <Alert
                message="O caminho inserido n??o cont??m uma imagem."
                description="Revisar o campo 'URL da imagem'"
                type="warning"
                className={styles.errorImgUrl}
                showIcon
              />
          }

          <Item
            name="status"
            label="Status da publica????o"
            className={styles.switch}
          >
            <Switch
              checkedChildren="Online"
              unCheckedChildren="Offline"
              checked={status}
              onChange={handleSwitchStatus}
              style={status ? { backgroundColor: "green" } : { backgroundColor: "red" }}
            />
          </Item>

          <div className="containerButtons">
            <Button
              stylesButton="buttonBack"
              handleClick={() => navigate("/conteudo-gratuito/listagem")}
            >
              <ImportOutlined className="iconActionPage" />
              Voltar
            </Button>

            <Button
              type="submit"
              stylesButton="buttonPrimary"
            >
              <SaveOutlined className="iconActionPage" />
              Salvar
            </Button>
          </div>
        </Form>
      </div>


      <ModalSuccess
        visible={modalSuccess}
        buttons={[{
          styles: "buttonDefault",
          handleClick: handleCloseModalSuccess,
          text: isEdit ? "Voltar para listagem" : "Fechar",
        }]}
        onCloseModal={handleCloseModalSuccess}
      >
        <div className="modalMessage">
          <p>
            Conte??do Gratuito {isEdit ? "editado" : "criado"} com sucesso!
          </p>
        </div>

      </ModalSuccess>

      <ModalError
        visible={modalError}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: handleCloseModalError,
        }]}
        onCloseModal={handleCloseModalError}
      >
        <div className="modalMessage">
          <p>Falha ao {isEdit ? "editar" : "criar"} conte??do gratuito!</p>

          <p>Mensagem de erro:</p>
          <p className="modalMessageAlert">
            {messageError || "N??o identificado."}
          </p>

          <p>
            {!messageError && "Entre em contato com a equipe de desenvolvimento."}
          </p>
        </div>
      </ModalError>
    </div>
  );
}

export default FreePostRegister;
