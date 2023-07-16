import { Button } from "@chakra-ui/react"
import { useState } from "react"

type ButtonWithLoadingProps = Parameters<typeof Button>[0] & {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (Promise<void> | void)
}

export const ButtonWithLoading = ({ children, onClick, ...props }: ButtonWithLoadingProps) => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Button
      {...props}
      isLoading={isLoading}
      onClick={e => {
        if (!onClick) {
          return
        }

        const res: unknown = onClick(e)
        if (res instanceof Promise) {
          Promise.resolve().then(async () => {
            setIsLoading(true)
            await res.catch(console.error)
            setIsLoading(false)
          })
        }
      }}
    >
      {children}
    </Button>
  )
}