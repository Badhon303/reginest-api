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
    update: SuperAdmins,
    delete: SuperAdmins,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'transactionId',
      type: 'text',
      maxLength: 99,
      required: true,
      unique: true,
    },
    {
      name: 'amount',
      type: 'number',
      max: 999999999,
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      options: [
        { label: 'BDT', value: 'bdt' },
        { label: 'USD', value: 'usd' },
      ],
      defaultValue: 'bdt',
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
    },
    {
      name: 'attendee',
      type: 'relationship',
      relationTo: 'attendees',
      required: true,
      hasMany: false,
    },
    {
      name: 'productName',
      type: 'text',
      maxLength: 99,
      defaultValue: 'Reginest Registration',
    },
    {
      name: 'productCategory',
      type: 'text',
      maxLength: 99,
      defaultValue: 'Registration Fee',
    },
    {
      name: 'productProfile',
      type: 'text',
      maxLength: 99,
      defaultValue: 'General',
    },
    {
      name: 'customerInfo', // required
      type: 'json', // required
    },
    {
      name: 'registrationDate',
      type: 'date',
      defaultValue: () => new Date(),
      access: { update: () => false, create: () => false },
    },
  ],
}
