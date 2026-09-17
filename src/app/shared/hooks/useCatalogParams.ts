"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";


export function useCatalogParams() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function setParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
        params.set(key, value);
        } else {
        params.delete(key);
        }

        params.delete("page");
        startTransition(() => {
        router.push(`${pathname}?${params}`);
        });
    }

    function reset(){
        startTransition(() => {
        router.push(pathname);
        })
    }
  return { setParam, reset, isPending, searchParams }
}
