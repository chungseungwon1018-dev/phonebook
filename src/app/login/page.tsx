import { login } from '@/app/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={login}
      >
        <h1 className="text-2xl font-bold text-center mb-6 tracking-tight">Login</h1>
        
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button className="bg-blue-600 rounded-md px-4 py-2 text-white font-medium hover:bg-blue-700 transition">
          Sign In
        </button>
        <a
          href="/signup"
          className="text-sm text-center font-medium mt-4 text-gray-500 hover:text-black transition"
        >
          Don&apos;t have an account? Sign Up
        </a>

        {params?.message && (
          <p className="mt-4 p-4 bg-red-100 text-red-600 text-center text-sm rounded-md">
            {params.message}
          </p>
        )}
      </form>
    </div>
  )
}
