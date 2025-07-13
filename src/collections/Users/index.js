export const Users = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200,
    cookies: {
      ...(process.env.NODE_ENV !== 'development' && {
        sameSite: 'None',
        domain: process.env.COOKIE_DOMAIN,
        secure: true,
      }),
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
