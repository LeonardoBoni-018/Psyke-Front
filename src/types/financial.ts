export interface Charge {
  id: string
  patientId: string
  description: string
  amount: number
  dueDate: string
  paid: boolean
}
