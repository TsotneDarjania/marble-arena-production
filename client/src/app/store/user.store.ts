import { create } from 'zustand'
import { UserType } from '../types/userTypes'

const useUsers = create((set) => ({
  users: [],
//   updateUsers: (newUsers) => set({ bears: newBears }),
}))