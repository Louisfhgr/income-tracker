export default function ({ redirect, $supabase, route }) {
  const user = $supabase.auth.user()
  if (!user && route.name !== 'login') {
    return redirect('/login')
  }
  if (user && route.name === 'index') {
    return redirect('/income')
  }
}
