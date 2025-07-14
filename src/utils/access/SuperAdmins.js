export const SuperAdmins = ({ req: { user } }) => {
  if (user) {
    if (user?.role === 'super-admin') {
      return true
    }
    return false
  }
}
