import { SuperAdmins } from '@/utils/access/SuperAdmins'

export const Users = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => {
      if (user) {
        if (user?.role !== 'super-admin') {
          return true
        }
        return false
      }
    },
  },
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 100, // 600 * 1000 Time period to allow the max login attempts
    cookies: {
      ...(process.env.NODE_ENV !== 'development' && {
        sameSite: 'None',
        domain: process.env.COOKIE_DOMAIN,
        secure: true,
      }),
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        if (user?.role === 'super-admin') {
          return true
        }

        return {
          id: {
            equals: user.id,
          },
        }
      }

      return false
    },
    create: SuperAdmins,
    update: () => false,
    delete: SuperAdmins,
    // admin: admins,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      type: 'select',
      access: { update: () => false },
      required: true,
      saveToJWT: true,
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
    },
  ],
}
