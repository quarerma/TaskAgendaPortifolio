import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../types/user.entity";
import { BASE_URL } from "../../env";

interface FilterProps {
  setNameToFilter: (name: string) => void;
  setTimeToFilter: (time: string) => void;
  setPriorityToFilter: (priority: string) => void;
}

export const Filter = ({
  setNameToFilter,
  setPriorityToFilter,
  setTimeToFilter,
}: FilterProps) => {
  const [filter, setFilter] = useState(""); // Renomeando para filter
  const [filterText, setFilterText] = useState("Filtrar por:");
  const [users, setUsers] = useState<User[]>([]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setFilterText("Nada");
    setFilter(selectedFilter);

    if (selectedFilter === "") {
      setTimeToFilter("");
      setNameToFilter("");
      setPriorityToFilter("");
    }
    if (selectedFilter === "prioridade") {
      setTimeToFilter("");
      setNameToFilter("");
    }
    if (selectedFilter === "tarefas_usuario") {
      setTimeToFilter("");
      setPriorityToFilter("");
    }
    if (selectedFilter === "tempo") {
      setNameToFilter("");
      setPriorityToFilter("");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}users/getAll`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <select
        onChange={handleFilterChange} // Renomeando o evento
        className="bg-amber-300 rounded-md w-1/2 max-md:w-full text-center hover:bg-yellow-500 transition-transform p-2 border border-gray-300"
      >
        <option
          value=""
          className="p-2 border  bg-amber-100 border-gray-300 rounded-md"
        >
          {filterText}
        </option>
        <option
          className="p-2 border border-gray-300  bg-amber-100 rounded-md"
          value="tarefas_usuario"
        >
          Tarefas de Usuário
        </option>
        <option
          className="p-2 border border-gray-300 bg-amber-100 rounded-md"
          value="tempo"
        >
          Tempo
        </option>
        <option
          className="p-2 border border-gray-300  bg-amber-100 rounded-md"
          value="prioridade"
        >
          Prioridade
        </option>
      </select>
      {filter === "prioridade" && (
        <select
          className="bg-amber-200 px-2 placeholder:text-amber-900 rounded-md"
          onChange={(event) => setPriorityToFilter(event.target.value)} // Corrigindo o método para setPriorityToFilter
        >
          <option
            className="p-2 border border-gray-300  bg-amber-100 rounded-md"
            value=""
          >
            Selecione uma prioridade
          </option>
          <option
            className="p-2 border border-gray-300  bg-amber-100 rounded-md"
            value="NONE"
          >
            Baixa
          </option>
          <option
            className="p-2 border border-gray-300  bg-amber-100 rounded-md"
            value="MEDIUM"
          >
            Média
          </option>
          <option
            className="p-2 border border-gray-300  bg-amber-100 rounded-md"
            value="URGENCY"
          >
            Urgente
          </option>
        </select>
      )}
      {filter === "tempo" && (
        <input
          onChange={(event) => setTimeToFilter(event.target.value)}
          type="number"
          placeholder="Tempo"
          className="bg-amber-200 px-2 placeholder:text-amber-900 rounded-md"
        />
      )}
      {filter === "tarefas_usuario" && (
        <select
          className="bg-amber-200 px-2 placeholder:text-amber-900 rounded-md"
          onChange={(event) => setNameToFilter(event.target.value)} // Corrigindo o método para setNameToFilter
        >
          <option value="">Selecione um usuário</option>
          {users.length > 0 &&
            users.map((user: User) => (
              <option key={user.name} value={user.name}>
                {user.name}
              </option>
            ))}
        </select>
      )}
    </>
  );
};

export default Filter;
