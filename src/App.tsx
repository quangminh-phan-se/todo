import { useCallback, useMemo, useState, memo } from "react";

type User = {
  id: number;
  name: string;
  age: number;
};

const users: User[] = Array.from({ length: 1000 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  age: Math.floor(Math.random() * 50) + 18,
}));

export default function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const sortedUsers = useMemo<User[]>(() => {
    return [...users].sort((a, b) => a.age - b.age);
  }, []);

  return (
    <div>
      <h2>After Optimization (TypeScript)</h2>
      {sortedUsers.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          selected={user.id === selectedId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

type UserRowProps = {
  user: User;
  selected: boolean;
  onSelect: (id: number) => void;
};

const UserRow = memo(function UserRow({ user, selected, onSelect }: UserRowProps) {
  console.log("render:", user.name);

  return (
    <div
      onClick={() => onSelect(user.id)}
      style={{
        backgroundColor: selected ? "#cfe8fc" : "white",
        cursor: "pointer",
      }}
    >
      {user.name} - {user.age}
    </div>
  );
});
