import { createRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Form, Input, Switch } from "antd";
import { ImportOutlined, SaveOutlined } from "@ant-design/icons";

import TableTopic from "./TableTopic";
import Modal from "../../../components/Modal";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import ModalError from "../../../components/Modal/components/ModalError";
import ModalSuccess from "../../../components/Modal/components/ModalSuccess";

import useStore from "../../../hooks/useStore";

import { ExclusivePostService } from "../../../services";

import styles from "../styles.module.css";

const { Item } = Form;
const { TextArea } = Input;

const FormSurvey = ({ isEdit, stateEdit, id }) => {
  const refForm = createRef();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [topicEdit, setTopicEdit] = useState("");
  const [totalVotes, setTotalVotes] = useState(null);
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [initialValues, setInitialValues] = useState(false);
  const [errorGetTopics, setErrorGetTopics] = useState(false);
  const [topicDescription, setTopicDescription] = useState("");
  const [modalCreateTopic, setModalCreateTopic] = useState(false);
  const [errorLengthTopics, setErrorLengthTopics] = useState(false);

  useEffect(() => {
    if (isEdit && !initialValues) {
      const { record: exclusivePost } = stateEdit;

      const { status } = exclusivePost;

      setStatus(status === "active" ? true : false);

      form.setFieldsValue({
        title: exclusivePost?.title,
        description: exclusivePost?.description,
      });

      (async () => await getTopics(id))();

      setInitialValues(true);
    }
  }, [isEdit, stateEdit]);

   const handleSwitchStatus = () => setStatus(!status);

  const handleCreateTopic = () => {
    setTopicDescription("");
    setModalCreateTopic(true);
  }

  const addNewTopic = () => {
    if (!topicDescription) return;

    const topicAlreadyExists = topics.some((topic) => {
      return topic?.description.toLowerCase() === topicDescription.toLowerCase()
    });

    if (topicAlreadyExists) return;

    setErrorLengthTopics(false);

    const topic = {
      id: null,
      votes: 0,
      description: topicDescription,
    };

    setTopics([...topics, topic ]);
    setModalCreateTopic(false);
  }

  const handleUpdateTopic = (description) => {
    setTopicEdit(description);
    setTopicDescription(description);
    setModalCreateTopic(true);
  }

  const updateTopic = () => {
    const newTopics = [];

    if (!topicDescription) return null;

    topics.forEach((topic) => {
      if (topic?.description.toLowerCase() === topicEdit.toLowerCase()) {
        newTopics.push({
          ...topic,
          description: topicDescription
        });

        return;
      }

      newTopics.push(topic);
    });

    setTopics(newTopics);
    setTopicEdit("");
    setModalCreateTopic(false);
  }

  const handleDeleteTopic = (description) => {
    const newTopics = [];

    topics.forEach((topic) => {
      if (topic?.description === description) {
        if (!topic?.id) return;

        newTopics.push({ ...topic, remove: true });
        return;
      }

      newTopics.push(topic);
    });

    setTopics(newTopics);
  }

  const handleTopicDescription = ({ target }) => setTopicDescription(target?.value);

  const handleCloseModalSuccess = () => {
    setModalSuccess(false);
    if (isEdit) navigate("/conteudo-exclusivo/listagem");

    setTopics([]);
    setStatus(true);
    setTopicEdit("");
    setTopicDescription("");
  }

  const getTopics = async (id) => {
    setLoading(true);
    try {
      const { data: {
        pollTopics,
        totalVotes,
      }} = await ExclusivePostService.findPollTopics(id);

      setTopics(pollTopics);
      setTotalVotes(totalVotes);
    } catch (e) {
      setErrorGetTopics(true);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (values) => {
    const lengthData = topics.reduce((sum, value) => {
      if (!value?.remove) {
        sum++;
      }

      return sum;
    }, 0);

    if (lengthData < 2) {
      setErrorLengthTopics(true);
      return;
    }

    const { getDataLocalStorage } = useStore();
    const username = getDataLocalStorage("user")?.username;

    const payload = {
      title: values.title,
      description: values.description,
      type: "SURVEY",
      username,
      status,
      pollTopics: topics,
    };

    setLoading(true);
    try {
      const idUpdate = isEdit ? id : null;
      const operation = isEdit ? ExclusivePostService.editSurvey : ExclusivePostService.createSurvey;
      await operation(payload, idUpdate);

      form.resetFields();
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
        name="create-exclusive-post-survey"
      >
       <Item
         required
         name="title"
         label="Título"
         rules={[ requiredRule ]}
       >
         <Input placeholder="Digite um título" />
       </Item>

        <Item
          required
          name="description"
          label="Descrição"
          rules={[ requiredRule ]}
        >
          <TextArea
            rows={4}
            showCount
            maxLength={2000}
            disabled={totalVotes > 0 && isEdit}
            placeholder="Descrição da enquete"
          />
        </Item>

        <div className={styles.containerTableTopics}>
          <p>Tópicos da enquete:</p>

          <TableTopic
            data={topics}
            totalVotes={totalVotes}
            errorGetTopics={errorGetTopics}
            handleEditTopic={handleUpdateTopic}
            handleCreateTopic={handleCreateTopic}
            handleDeleteTopic={handleDeleteTopic}
          />

          {errorLengthTopics && (
            <p className="text-red">Deve haver no mínimo 2 tópicos e no máximo 5!</p>
          )}
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

        <div className="containerButtons">
          <Button
            stylesButton="buttonBack"
            handleClick={() => navigate("/conteudo-exclusivo/listagem")}
          >
            <ImportOutlined className="iconActionPage" />
            Voltar
          </Button>

          <Button
            type="submit"
            disabled={errorGetTopics}
            stylesButton="buttonPrimary"
          >
            <SaveOutlined className="iconActionPage" />
            Salvar
          </Button>
        </div>
      </Form>

      <Modal
        visible={modalCreateTopic}
        buttons={[
          {
            text: "Cancelar",
            styles: "buttonDefault",
            handleClick: () => setModalCreateTopic(false),
          },
          {
            text: "Salvar",
            styles: "buttonBackground buttonMarginLeft",
            handleClick: topicEdit ? updateTopic : addNewTopic
          }
        ]}
        onCloseModal={() => setModalCreateTopic(false)}
      >
        <div className={styles.modalDescriptionTopic}>
          <h3>Cadastrar novo tópico</h3>

          <p>Tópico:</p>
          <Input
            value={topicDescription}
            onChange={handleTopicDescription}
            placeholder="Digite a descrição do tópico"
          />
        </div>
      </Modal>

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
            Enquete {isEdit ? "editada" : "criada"} com sucesso!
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
          <p>Falha ao {isEdit ? "editar" : "criar"} enquete!</p>

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
};

export default FormSurvey;