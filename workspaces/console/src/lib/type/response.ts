export const STATS_SUCCESS = "success" as const;
export const STATS_ERROR = "error" as const;
export const STATS_LOADING = "loading" as const;

type Error<E extends string, R = void> = R extends void
  ? { status: typeof STATS_ERROR; code: E }
  : { status: typeof STATS_ERROR; code: E; reason: R };

type Success<D> = { status: typeof STATS_SUCCESS; data: D };

type UnknownError = Error<"unknown_error">;

export type Response<D, E extends Error<string, unknown> = never> =
  | Success<D>
  | UnknownError
  | E;

export type AsyncState<D, E extends Error<string, unknown> = never> =
  | { status: typeof STATS_LOADING }
  | Success<D>
  | UnknownError
  | E;

export type Response2AsyncState<R extends Response<unknown>> =
  | {
      status: typeof STATS_LOADING;
    }
  | R;
