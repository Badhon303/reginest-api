import { SuperAdmins } from '../../utils/access/SuperAdmins'

export const Products = {
  slug: 'products',
  admin: {
    useAsTitle: 'productName',
  },
  access: {
    read: () => true,
    create: SuperAdmins,
    update: ({ req: { user } }) => {
      if (user) {
        if (user?.role === 'super-admin' || user?.role === 'admin') {
          return true
        }
      }
      return false
    },
    delete: SuperAdmins,
  },
  fields: [
    {
      name: 'price',
      type: 'number',
      required: true,
      max: 999999999,
      min: 10,
    },
    {
      name: 'deadLine',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime', // This enables both date and time selection
        },
      },
    },
    {
      name: 'productName',
      type: 'text',
      unique: true,
      required: true,
      maxLength: 99,
      defaultValue: 'Reginest Registration',
      access: { update: () => false },
    },
    {
      name: 'productCategory',
      type: 'text',
      maxLength: 99,
      required: true,
      defaultValue: 'Registration Fee',
      access: { update: () => false },
    },
  ],
}
