import { useApiClient, userApi } from "@/utils/api"
import { useClerk } from "@clerk/clerk-expo"
import { useMutation } from "@tanstack/react-query"
import {  useEffect, } from "react"


export const useUserSync = () => {
  const { isSignedIn } = useClerk()
  const api = useApiClient()
  

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => {
      console.log('User synced successfully', response.data.user)
    },
    onError: (error: Error) => {
      console.error('Error syncing user', error)
      //todo: add toast
    }
  })

  const isSynced = syncUserMutation.data


  useEffect(() => {
    if (!isSynced && isSignedIn) {
     syncUserMutation.mutate()
    }
  }, [isSignedIn, isSynced])

  return null;
}