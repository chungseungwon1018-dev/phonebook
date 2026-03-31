import { signup } from '@/app/actions'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signup}
      >
        <h1 className="text-2xl font-bold text-center mb-6 tracking-tight">Sign Up</h1>
        
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
        
        <button className="bg-black rounded-md px-4 py-2 text-white font-medium hover:bg-gray-800 transition">
          Sign Up
        </button>
        <a
          href="/login"
          className="text-sm text-center font-medium mt-4 text-gray-500 hover:text-black transition"
        >
          Already have an account? Sign In
        </a>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-neutral-100 text-neutral-600 text-center text-sm rounded-md">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
