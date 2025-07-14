import { SuperAdmins } from '@/utils/access/SuperAdmins'

export const Payments = {
  slug: 'payments',
  admin: {
    useAsTitle: 'transactionId',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        if (user?.role === 'super-admin' || user?.role === 'admin') {
          return true
        }
      }
      return false
    },
    create: SuperAdmins,
    update: () => SuperAdmins,
    delete: SuperAdmins,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'transactionId',
      type: 'text',
      maxLength: 99, // regex may required
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'failed',
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Credit Card', value: 'credit-card' },
        { label: 'Bkash', value: 'bkash' },
        { label: 'Nagad', value: 'nagad' },
      ],
      defaultValue: 'credit-card',
    },
    {
      name: 'attendee',
      type: 'relationship',
      relationTo: 'attendees',
      required: true,
      hasMany: false,
    },
  ],
}
