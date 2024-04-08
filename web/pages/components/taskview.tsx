import { useState } from "react";
import { Task } from "../../types/task";
import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../env";

interface TaskViewProps {
  task: Task;
}

export const TaskView = ({ task }: TaskViewProps) => {
  const [localCompleted, setLocalCompleted] = useState(task.completed);
  const [timeCompleted, setTimeCompleted] = useState(task.completedAt);

  const changeComplete = () => {
    setLocalCompleted(!localCompleted);
    setTimeCompleted(new Date());
  };

  const handleCompleteTask = async () => {
    try {
      await fetch(
        `${BASE_URL}tasks/${localCompleted ? "uncomplete" : "complete"}/${
          task.id
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          method: "PUT",
        }
      );
      if (localCompleted) {
        setTimeCompleted(undefined);
        toast.success("Conclusão cancelada!");
      } else {
        toast.success("Tarefa concluída!");
      }
    } catch (error) {
      console.error("Erro ao completar tarefa:", error);
    }
  };

  const priority = () => {
    switch (task.priority) {
      case "NONE":
        return "Nenhuma";
      case "MEDIUM":
        return "Média";
      case "URGENCY":
        return "Urgente";
      default:
        return "Nenhuma";
    }
  };

  const type = () => {
    switch (task.taskType) {
      case "PROJECT":
        return "Projeto";
      case "REUNION":
        return "Reunião";
      case "VISIT":
        return "Visita";
      default:
        return "Nenhuma";
    }
  };

  const formattedEndDate = format(new Date(task.endAt), "dd/MM/yyyy - HH:mm");
  const formattedCreatedAt = format(
    new Date(task.createdAt),
    "dd/MM/yyyy - HH:mm"
  );
  const formattedCompletedAt = timeCompleted
    ? format(new Date(timeCompleted), "dd/MM/yyyy - HH:mm")
    : "";

  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-left text-amber-900">
        <div className="bg-gradient-to-b from-amber-200 to-yellow-600/80  hover:from-slate-500/30 hover:to-black/50 w-full h-full overflow-hidden outline-none rounded-md p-5 relative">
          <div
            className={`w-3 h-3 absolute top-2 right-2 rounded-full ${
              localCompleted ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <div>
            <span>
              <strong>Título: </strong> {task.title} <br />
            </span>
            <span>
              <strong>Data:</strong> {formattedEndDate} <br />
            </span>
            <span>
              <strong>Prioridade: </strong>
            </span>
            <span>
              {priority()} <br />
            </span>
            <span>
              <strong>Tipo: </strong>
            </span>
            <span>{type()}</span>
          </div>
          <span>
            <strong>Criado por: </strong> {task.postedBy}
          </span>
          <p>
            <strong>Descrição: </strong> {task.description}
          </p>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className=" bg-gradient-to-b from-amber-300 to-yellow-700 border-1 border-amber-950 fixed lg:w-[60%] md:[70%] w-[90%] h-[80%] rounded-md p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Dialog.Close className="absolute top-2 right-2  z-50 hover:scale-125">
            <IoMdCloseCircleOutline className="text-3xl" />
          </Dialog.Close>

          <div className="md:space-y-3 space-y-1 md:text-[1.1rem] text-[0.9rem] text-amber-800">
            <h1 className="md:text-3xl font-bold text-1xl text-center mb-2">
              {task.title}
            </h1>
            <div className="space-y-2 border p-2 rounded-sm border-amber-950">
              <span>
                <strong>Prazo Final:</strong> {formattedEndDate} <br />
              </span>
              <p>
                <strong>Data de criação:</strong> {formattedCreatedAt}
              </p>
              <p>
                <strong>Criado por:</strong> {task.postedBy}
              </p>
              <p>
                <strong>Prioridade:</strong> {priority()}
              </p>
              <p>
                <strong>Tipo:</strong> {type()}
              </p>
              {localCompleted && (
                <p>
                  <strong>Completada em:</strong> {formattedCompletedAt}
                </p>
              )}
            </div>
          </div>
          <div className="flex md:text-[1.3rem] text-[1.0rem] mx-auto justify-center relative  w-fit gap-x-10 mt-5 font-bold">
            <button
              onClick={() => {
                changeComplete();
                handleCompleteTask();
              }}
              className={`border border-amber-800 p-2 rounded-md text-white ${
                localCompleted
                  ? " bg-red-500 hover:bg-red-600 hover:text-orange-100"
                  : "hover:bg-cyan-500 hover:text-cyan-100 bg-cyan-600 "
              }  transition-colors duration-300 `}
            >
              {localCompleted ? "Desfazer" : "Concluir"}
            </button>
            <Link
              className="border border-amber-800 p-2 rounded-md bg-neutral-400 text-white hover:bg-neutral-500 hover:text-gray-100 transition-colors duration-300"
              to={`/edit/${task.id}`}
            >
              Editar
            </Link>
          </div>
          <p className="md:mt-10 mt-4 md:text-[1.1rem] text-amber-900 p-2 mb-2">
            <strong className="md:text-3xl text-1xl "> Descrição:</strong>{" "}
            <br />
            {task.description}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
      <Toaster />
    </Dialog.Root>
  );
};
export default TaskView;
