import { createRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Switch, Tooltip, Button } from "antd";
import { ImportOutlined, SaveOutlined, PlusCircleOutlined } from "@ant-design/icons";

import TableMedia from "./TableMedia";
import Modal from "../../../components/Modal";
import Loader from "../../../components/Loader";
import ButtonDefault from "../../../components/Button";
import ModalError from "../../../components/Modal/components/ModalError";
import ModalSuccess from "../../../components/Modal/components/ModalSuccess";

import useStore from "../../../hooks/useStore";

import { ExclusivePostService } from "../../../services";

import styles from "../styles.module.css";
import TableLink from "./TableLink";
import ModalLink from "./ModalLink";

const { Item } = Form;
const { TextArea } = Input;

const FormContent = ({ isEdit, stateEdit, id }) => {
  const refForm = createRef();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [links, setLinks] = useState([]);
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState(true);
  const [urlMedia, setUrlMedia] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [imageSelected, setImageSelected] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [initialValues, setInitialValues] = useState(false);
  const [errorGetMedia, setErrorGetMedia] = useState(false);
  const [errorGetLinks, setErrorGetLinks] = useState(false);
  const [openModalImage, setOpenModalImage] = useState(false);
  const [modalRegisterLink, setModalRegisterLink] = useState(false);
  
  useEffect(() => {
    if (isEdit && !initialValues) {
      const { record: exclusivePost } = stateEdit;

      const { status } = exclusivePost;

      setStatus(status === "active" ? true : false);

      form.setFieldsValue({
        title: exclusivePost?.title,
        description: exclusivePost?.description,
      });

      (async () => {
        await getMedia(id);
        await getLinks(id);
      })();

      setInitialValues(true);
    }
  }, [isEdit, stateEdit]);

  const handleMedia = () => {
    const regex = /(http)?s?:?(\/\/[^"']*\.(?:|jpg|jpeg|gif|png|svg))/;
    if (!regex.test(urlMedia)) return;

    const urlAlreadyExist = media.some((record) => record.url === urlMedia);
    if (urlAlreadyExist) return;

    setMedia([...media, { id: null, url: urlMedia, remove: false }]);
    setUrlMedia("");
  }

  const removeMedia = (url) => {
    const newMedia = [];

    media.forEach((record) => {
      if (record.url === url) {
        if (!record.id) return;

        newMedia.push({ ...record, remove: true });
        return;
      }

      newMedia.push(record);
    });

    setMedia(newMedia);
  }

  const removeLinks = (url) => {
    const newLinks = [];

    links.forEach((record) => {
      if (record.url === url) {
        if (!record.id) return;

        newLinks.push({ ...record, remove: true });
        return;
      }

      newLinks.push(record);
    });

    setLinks(newLinks);
  }

  const handleSwitchStatus = () => setStatus(!status);
  const handleUrl = ({ target: { value } }) => setUrlMedia(value);

  const openModalViewImage = (url) => {
    setImageSelected(url);
    setOpenModalImage(true);
  };

  const handleCloseModalSuccess = () => {
    setModalSuccess(false);
    if (isEdit) navigate("/conteudo-exclusivo/listagem");

    setMedia([]);
    setStatus(true);
    setUrlMedia("");
  }

  const openModalRegisterLink = () => {
    setModalRegisterLink(true);
  }

  const closedModalRegisterLink = () => {
    setModalRegisterLink(false);
  }

  const getMedia = async (id) => {
    setLoading(true);
    try {
      const { data } = await ExclusivePostService.findMedia(id);
      setMedia(data ? data : []);
    } catch (e) {
      setErrorGetMedia(true);
    } finally {
      setLoading(false);
    }
  }

  const getLinks = async (id) => {
    setLoading(true);
    try {
      const { data } = await ExclusivePostService.findLinks(id);
      setLinks(data ? data : []);
    } catch (e) {
      setErrorGetLinks(true);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (values) => {
    const { getDataLocalStorage } = useStore();
    const username = getDataLocalStorage("user")?.username;

    const payload = {
      title: values.title,
      description: values.description,
      type: "TEXT",
      username,
      status,
      media,
      links,
    };

    setLoading(true);
    try {
      const idUpdate = isEdit ? id : null;
      const operation = isEdit ? ExclusivePostService.editContent : ExclusivePostService.createContent;
      await operation(payload, idUpdate);

      form.resetFields();
      setMedia([]);
      setLinks([]);
      setModalSuccess(true);
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

  const requiredRule = {
    required: true,
    message: "Campo obrigatório! Preencha corretamente!",
  };

  return (
    <>
      <Loader loading={loading} />

      <Form
        form={form}
        ref={refForm}
        onFinish={onSubmit}
        name="create-exclusive-post-content"
      >
        <Item
          required
          name="title"
          label="Título"
          rules={[requiredRule]}
        >
          <Input placeholder="Digite um título" />
        </Item>

        <Item
          required
          name="description"
          label="Descrição"
          rules={[requiredRule]}
        >
          <TextArea
            rows={4}
            showCount
            maxLength={2000}
            placeholder="Descrição do conteúdo"
          />
        </Item>

        <Item
          name="url"
          label="URL da imagem"
        >
          <Input.Group>
            <Input
              value={urlMedia}
              onChange={handleUrl}
              disabled={errorGetMedia}
              className={styles.InputWithButton}
              placeholder="Informe a URL da imagem"
            />
            <Tooltip title="adicionar nova URL a lista">
              <Button
                onClick={handleMedia}
                disabled={errorGetMedia}
                icon={<PlusCircleOutlined />}
              />
            </Tooltip>
          </Input.Group>
        </Item>

        <div className={styles.containerTableMedia}>
          <TableMedia
            data={media}
            handleDelete={removeMedia}
            handleView={openModalViewImage}
          />
        </div>

        <Item
          required
          name="status"
          label="Status"
        >
          <Switch
            checkedChildren="Online"
            unCheckedChildren="Offline"
            checked={status}
            onChange={handleSwitchStatus}
            style={status ? { backgroundColor: "green" } : { backgroundColor: "red" }}
          />
        </Item>

        <ButtonDefault
          type="button"
          disabled={errorGetLinks}
          handleClick={openModalRegisterLink}
          stylesButton="buttonDefault width-100"
        >
          Adicionar link de referência
        </ButtonDefault>

        <div className={styles.containerTableLink}>
          <TableLink
            data={links}
            handleDelete={removeLinks}
          />
        </div>

        <div className="containerButtons">
          <ButtonDefault
            stylesButton="buttonBack"
            handleClick={() => navigate("/conteudo-exclusivo/listagem")}
          >
            <ImportOutlined className="iconActionPage" />
            Voltar
          </ButtonDefault>

          <ButtonDefault
            type="submit"
            stylesButton="buttonPrimary"
          >
            <SaveOutlined className="iconActionPage" />
            Salvar
          </ButtonDefault>
        </div>
      </Form>

      <Modal
        visible={openModalImage}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: () => setOpenModalImage(false),
        }]}
        onCloseModal={() => setOpenModalImage(false)}
      >
        <div className={styles.modalViewImage}>
          <p><span>URL: </span> {imageSelected}</p>
          <img src={imageSelected} alt={`Imagem selecionada - ${imageSelected}`} />
        </div>
      </Modal>

      <ModalLink
        links={links}
        setLinks={setLinks}
        visible={modalRegisterLink}
        handleClosed={closedModalRegisterLink}
      />

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
            Conteúdo {isEdit ? "editado" : "criado"} com sucesso!
          </p>
        </div>
      </ModalSuccess>

      <ModalError
        visible={modalError}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: () => setModalError(false),
        }]}
        onCloseModal={() => setModalError(false)}
      >
        <div className="modalMessage">
          <p>Falha ao {isEdit ? "editar" : "criar"} conteúdo!</p>

          <p>Mensagem de erro:</p>
          <p className="modalMessageAlert">
            {messageError || "Não identificado."}
          </p>

          <p>
            {!messageError && "Entre em contato com a equipe de desenvolvimento."}
          </p>
        </div>
      </ModalError>
    </>
  );
}

export default FormContent;
