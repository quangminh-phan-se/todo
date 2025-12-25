import { useCallback, useState } from "react";

export function useToggle(initialValue = false) {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  const setOn = useCallback(() => {
    setValue(true)
  }, [])

  const setOff = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, setOn, setOff]
}
