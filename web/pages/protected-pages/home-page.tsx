import { useState, useEffect } from "react";
import { User } from "../../types/user.entity";
import { RiLogoutBoxLine } from "react-icons/ri";
import Filter from "../components/filter";
import TaskView from "../components/taskview";
import { Task } from "../../types/task";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../env";
import logo from "/src/assets/logo.png";

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nameToFilter, setNameToFilter] = useState("");
  const [timeToFilter, setTimeToFilter] = useState("");
  const [priorityToFilter, setPriorityToFilter] = useState("");
  const [tasks, setTasks] = useState<Task[] | null>();
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[] | null>();
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    const startServer = async () => {
      try {
        console.log("startServer");
        await fetch(`${BASE_URL}tasks/startServer`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };
    startServer();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let url = `${BASE_URL}tasks/findAll`;
        let message = "Buscando todas tarefas...";

        if (nameToFilter) {
          url = `${BASE_URL}tasks/findTaskByUser/${nameToFilter}`;
          message = `Exibindo tarefas de ${nameToFilter}...`;
        } else if (timeToFilter) {
          url = `${BASE_URL}tasks/getTasksOnTimeRange/${timeToFilter.toString()}`;
          message = `Exibindo tarefas no período de ${timeToFilter} dias...`;
        } else if (priorityToFilter) {
          url = `${BASE_URL}tasks/filterByPriority/${priorityToFilter}`;
          message = `Exibindo tarefas com prioridade ${priorityToFilter}...`;
        }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        const data = await response.json();
        setTasks(data);
        toast.success(message);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTasks();
  }, [nameToFilter, timeToFilter, priorityToFilter]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      const jwtData = JSON.parse(atob(jwt.split(".")[1])) as User;
      setUser(jwtData);
    }
  }, []);

  useEffect(() => {
    const searchTasks = async () => {
      if (search === "") setFilteredTasks(null);
      else {
        const filtered = tasks?.filter((task) =>
          task.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredTasks(filtered);
      }
    };
    searchTasks();
  }, [search, tasks]);

  return (
    <>
      <Toaster />
      <img
        className="px-7 max-md:px-2 max-md:mt-2 max-md:scale-105 "
        src={logo}
        alt="logo"
      />
      ;
      <div className="my-6 space-y-6  md:px-12 px-6 font-semibold text-amber-900">
        <div className="space-y-6 ">
          <h1 className="text-[1.4rem] max-md:text-1xl font-bold">
            Bem vindo, {user?.name}
          </h1>
          <form>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tarefa por título..."
              className="text-3xl max-md:text-2xl bg-transparent outline-none placeholder:text-amber-900 w-full"
            />
          </form>
          <div className="h-px bg-amber-950"></div>
          <div className="flex gap-x-4 max-md:flex-col size-full max-md:gap-y-6">
            <Link
              to={"/add"}
              className="bg-amber-300 p-2 rounded-md w-[50%] max-md:w-full text-center hover:bg-yellow-500 hover:text-slate-100 transition-transform"
            >
              Adicionar Tarefa
            </Link>
            <Filter
              setNameToFilter={setNameToFilter}
              setTimeToFilter={setTimeToFilter}
              setPriorityToFilter={setPriorityToFilter}
            />
          </div>
          <label className="flex items-center gap-x-2">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}
              className="rounded border-gray-400 text-amber-900"
            />
            Exibir concluídas
          </label>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-10 auto-rows-[250px] text-amber-900">
          {(search ? filteredTasks : tasks)?.map(
            (task) =>
              (!task.completed || showCompleted) && (
                <TaskView key={task.id} task={task} />
              )
          )}
        </div>

        <Link
          to="/login"
          className="cursor-pointer px-2 max-md:top-5 text-3xl flex gap-x-2 group right-0 top-0 absolute"
          onClick={() => {
            localStorage.removeItem("jwt");
          }}
        >
          <span className="mt-1  text-[1.3rem]  opacity-0 group-hover:opacity-100 ">
            Sair
          </span>
          <RiLogoutBoxLine className="mt-2 " />
        </Link>
      </div>
    </>
  );
};

export default HomePage;
