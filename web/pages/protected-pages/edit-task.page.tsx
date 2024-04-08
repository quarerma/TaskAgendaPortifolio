import { useEffect, useState } from "react";

import { Priority, TaskType, UpdateTaskDto } from "../../types/task";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../env";

export const AddTaskPage = () => {
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedEndAt, setUpdatedEndAt] = useState<Date>(new Date());
  const [updatedTaskType, setUpdatedTaskType] = useState<TaskType>("REUNION");
  const [updatedPriority, setUpdatedPriority] = useState<Priority>("NONE");

  const id = useParams<{ id: string }>().id;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${BASE_URL}tasks/getTaskById/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        const data = await response.json();
        setUpdatedTitle(data.title);
        setUpdatedDescription(data.description);
        setUpdatedEndAt(new Date(data.endAt));
        setUpdatedTaskType(data.taskType);
        setUpdatedPriority(data.priority);
      } catch (error) {
        console.error("Erro ao buscar tarefa:", error);
      }
    };
    fetchTask();
  }, [id]);

  const handleAddTask = async () => {
    if (
      !id ||
      !updatedTitle ||
      !updatedDescription ||
      !updatedEndAt ||
      !updatedTaskType ||
      !updatedPriority
    ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (updatedEndAt.getTime() < new Date().getTime()) {
      toast.error("Data inválida.");
      return;
    }
    try {
      const updateTask: UpdateTaskDto = {
        id,
        title: updatedTitle,
        description: updatedDescription,
        endAt: updatedEndAt.toISOString(),
        taskType: updatedTaskType,
        priority: updatedPriority,
      };

      await axios.patch(`${BASE_URL}tasks/atualizar`, updateTask, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      toast.success("Tarefa atualizada com sucesso!");
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
      <div className="w-[95%] mt-10 mb-10 md:w-[70%] lg:w-[50%] xl:w-[40%] font-semibold bg-amber-200/70 rounded-lg md:p-8 ">
        <h1 className="text-3xl text-amber-900 text-center p-2">
          Editar Tarefa
        </h1>
        <div className="flex flex-col gap-y-4 p-4">
          <input
            type="text"
            placeholder="Título"
            className="p-2 rounded-md placeholder:text-black placeholder:font-semibold bg-amber-300/50 border border-yellow-400"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            className="p-2 rounded-md placeholder:text-black placeholder:font-semibold h-[300px] bg-amber-300/50 border border-yellow-400" // Ajuste o tamanho conforme necessário
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          ></textarea>
          <input
            type="datetime-local"
            className="p-2 rounded-md bg-amber-300/50 border hover:bg-amber-400 border-yellow-400"
            value={new Date(
              updatedEndAt.getTime() - updatedEndAt.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)}
            onChange={(e) => setUpdatedEndAt(new Date(e.target.value))}
          />
          <select
            className="p-2 rounded-md bg-amber-300/50 hover:bg-amber-400 border border-yellow-400"
            value={updatedTaskType}
            onChange={(e) => setUpdatedTaskType(e.target.value as TaskType)}
          >
            <option value="REUNION">Reunião</option>
            <option value="VISIT">Visita</option>
            <option value="PROJECT">Projeto</option>
          </select>
          <select
            className="p-2 rounded-md hover:bg-amber-400 bg-amber-300/50 border border-yellow-400"
            value={updatedPriority}
            onChange={(e) => setUpdatedPriority(e.target.value as Priority)}
          >
            <option value="NONE">Nenhuma</option>
            <option value="MEDIUM">Média</option>
            <option value="URGENCY">Urgente</option>
          </select>
          <button
            onClick={handleAddTask}
            className="p-2 bg-amber-500 mt-2 rounded-md hover:bg-yellow-500 hover:text-slate-100 transition-transform"
          >
            Salvar
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
