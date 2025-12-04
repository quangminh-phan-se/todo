import { useState, useMemo, type ChangeEvent } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";
type Sort = "latest" | "oldest" | "az" | "za";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("latest");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput("");
  };

  const updateTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: editingText } : t))
    );
    setEditingId(null);
    setEditingText("");
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTodos = useMemo<Todo[]>(() => {
    const filtered = todos
      .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => {
        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
      });

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "latest":
          return b.id - a.id;
        case "oldest":
          return a.id - b.id;
        case "az":
          return a.text.localeCompare(b.text);
        case "za":
          return b.text.localeCompare(a.text);
        default:
          return 0;
      }
    });

    return sorted;
  }, [todos, search, filter, sort]);

  const totalPages = Math.ceil(filteredTodos.length / pageSize);
  const paginated = filteredTodos.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Todo List</h1>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Add todo..."
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      <input
        className="border p-2 w-full rounded"
        placeholder="Search todo..."
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />

      <div className="flex gap-2 justify-center">
        {[
          { label: "All", value: "all" as Filter },
          { label: "Active", value: "active" as Filter },
          { label: "Completed", value: "completed" as Filter },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1 rounded border ${
              filter === f.value ? "bg-gray-200" : ""
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSort(e.target.value as Sort)
          }
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      <ul className="space-y-2">
        {paginated.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />

              {editingId === todo.id ? (
                <input
                  className="border p-1 rounded"
                  value={editingText}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditingText(e.target.value)
                  }
                />
              ) : (
                <span
                  className={todo.completed ? "line-through text-gray-500" : ""}
                >
                  {todo.text}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {editingId === todo.id ? (
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded"
                  onClick={() => updateTodo(todo.id)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="px-2 py-1 bg-yellow-400 text-white rounded"
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditingText(todo.text);
                  }}
                >
                  Edit
                </button>
              )}

              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-2 pt-4">
        <button
          className="px-3 py-1 border rounded"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
