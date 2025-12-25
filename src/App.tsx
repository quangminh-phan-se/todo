import { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";

// tim hieu ve debounce va throttler
// thu viet 1 cai hook cho throttler

export default function TodoApp() {
  const [value, setValue] = useState('')
  const debounceValue = useDebounce(value, 300)

  useEffect(() => {
    if (!debounceValue.trim()) return;

    console.log('call API with:', debounceValue)
  }, [debounceValue])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div>
      <label>
        Text input: <input style={{ borderColor: 'black' }} name="myInput" onChange={handleChange} />
      </label>
      <p>{`value: ${value}`}</p>
      <p>{`debounceValue: ${debounceValue}`}</p>
    </div>
  );
}
