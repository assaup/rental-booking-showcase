import { NextResponse } from "next/server";
import { equipment } from "@/server/mock/equipment";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const found = equipment.find((item) => item.id === encodeURIComponent(id))

  if (!found){
    return NextResponse.json({ message: "Позиция не найдена" }, { status: 404 })
  }
   return NextResponse.json(found)
}