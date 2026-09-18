export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
  }
}

export async function throwApiError(res: Response): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new ApiError(res.status, body?.message ?? `Ошибка ${res.status}`, body);
}