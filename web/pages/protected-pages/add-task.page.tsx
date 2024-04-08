import { useEffect, useState } from "react";
import { User } from "../../types/user.entity";
import { CreateTaskDto, Priority, TaskType } from "../../types/task";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../env";

export const AddTaskPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endAt, setEndAt] = useState<Date>(new Date());
  const [taskType, setTaskType] = useState<TaskType>("REUNION");
  const [priority, setPriority] = useState<Priority>("NONE");

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      const jwtData = JSON.parse(atob(jwt.split(".")[1])) as User;
      setUser(jwtData);
    }
  }, []);

  const handleAddTask = async () => {
    if (!user || !title || !description || !endAt || !taskType || !priority) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (endAt.getTime() < new Date().getTime()) {
      toast.error("Data inválida.");
      return;
    }
    try {
      const newTask: CreateTaskDto = {
        title,
        description,
        postedBy: user.name,
        endAt: endAt.toISOString(),
        taskType,
        priority,
      };

      await axios.post(`${BASE_URL}tasks/create`, newTask, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      toast.success("Tarefa criada com sucesso!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response?.status === 500) {
            toast.error("Já existe uma tarefa nesse horário.");
          }
        } else if (axiosError.request) {
          toast.error("Erro de requisição ao criar tarefa.");
        } else {
          toast.error("Erro ao criar tarefa.");
        }
      } else {
        toast.error("Erro ao criar tarefa.");
      }
    }
  };

  return (
    <div className="w-screen h-fit  itens-center justify-center flex ">
      <div className="w-[95%] mt-10 mb-10 md:w-[70%] lg:w-[50%] xl:w-[40%] bg-amber-200/70 font-semibold rounded-lg md:p-8 ">
        <h1 className="text-3xl text-amber-900 text-center p-2">
          Adicionar Tarefa
        </h1>
        <div className="flex flex-col gap-y-4 p-4">
          <input
            type="text"
            placeholder="Título"
            className="p-2 rounded-md placeholder:text-black placeholder:font-semibold bg-amber-300/50 border border-yellow-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            className="p-2 rounded-md placeholder:text-black placeholder:font-semibold h-[300px] bg-amber-300/50 border border-yellow-400" // Ajuste o tamanho conforme necessário
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="datetime-local"
            className="p-2 rounded-md bg-amber-300/50 border hover:bg-amber-400 border-yellow-400"
            value={new Date(endAt.getTime() - endAt.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16)}
            onChange={(e) => setEndAt(new Date(e.target.value))}
          />
          <select
            className="p-2 rounded-md bg-amber-300/50 hover:bg-amber-400 border border-yellow-400"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskType)}
          >
            <option value="REUNION">Reunião</option>
            <option value="VISIT">Visita</option>
            <option value="PROJECT">Projeto</option>
          </select>
          <select
            className="p-2 rounded-md hover:bg-amber-400 bg-amber-300/50 border border-yellow-400"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="NONE">Nenhuma</option>
            <option value="MEDIUM">Média</option>
            <option value="URGENCY">Urgente</option>
          </select>
          <button
            onClick={handleAddTask}
            className="p-2 bg-amber-500 mt-2 rounded-md hover:bg-yellow-500 hover:text-slate-100 transition-transform"
          >
            Adicionar
          </button>

          <Link
            to="/home"
            className="text-amber-500 hover:underline text-center w-full"
          >
            Voltar para a página inicial
          </Link>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default AddTaskPage;
