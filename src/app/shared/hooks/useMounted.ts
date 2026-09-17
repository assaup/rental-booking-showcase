import { useEffect, useState } from "react";


export function useMounted(){
  const [mounted, setMounted] = useState();

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted
}
