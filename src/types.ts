export type UnSubscribable = {
  unsubscribe: () => void
}

export type Callback<I extends [], O> = (...args: I) => O
export type SubscribingFunction<I extends [], O> = (callback: Callback<I, O>) => UnSubscribable
