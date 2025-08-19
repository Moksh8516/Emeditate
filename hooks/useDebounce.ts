import { useEffect, useState } from "react";

export const useDebounce = (initialValue: string, delay: number) => {
const [debounceValue, setDebounceValue] = useState(initialValue);
useEffect(() => {
    const timerId = setTimeout(()=>{
        setDebounceValue(initialValue)
    },delay)
    return () => {
        clearTimeout(timerId);
    };
},[initialValue, delay]);
return debounceValue;
}