"use client";

import { useEffect } from "react";
import { useCart } from "@/app/shared/cart/CartProvider";
import { useRouter, useSearchParams } from "next/navigation";




export function CatalogDatesSync() {
  const { state, dispatch } = useCart();
  const searchParams = useSearchParams()
  const router = useRouter()

  // даты из URL → в корзину
  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    if (from && to){
        dispatch({ type: "setDates", from, to})
        return 
    }

    if (state.from && state.to){
        const params = new URLSearchParams(searchParams.toString());
        params.set('from', state.from)
        params.set('to', state.to)
        params.delete('page')

        router.replace(`/?${params}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}