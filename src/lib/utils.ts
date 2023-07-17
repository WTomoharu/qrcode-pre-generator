export function range(length: number) {
  return Array.from({ length }, (_, i) => i)
}

export async function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export async function minTime<T extends unknown>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.allSettled([promise, sleep(ms)]).then(async ([result, _]) => {
    if (result.status === "fulfilled") {
      return result.value  
    } else {
      throw result.reason
    }
  })
}