import { signup } from "../_auth/actions";

export default async function Page() {
  return (
    <>
      <h1>Create an account</h1>
      <form action={signup}>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          id="username"
          className="block border border-gray-300 px-3 py-2"
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="block border border-gray-300 px-3 py-2"
        />

        <br />
        <button className="bg-gray-100 px-2 py-1.5 hover:bg-gray-200">
          Continue
        </button>
      </form>
    </>
  );
}
