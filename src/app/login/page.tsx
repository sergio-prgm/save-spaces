import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  FormSubmit,
} from "~/components/ui/form";
import { login } from "../_auth/actions";
import { Input } from "~/components/ui/input";

export default async function Page() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 md:max-w-xl">
      <h1>Log In</h1>
      <FormRoot action={login} className="">
        <FormField name="username">
          <FormLabel>User name</FormLabel>
          <FormControl asChild>
            <Input type="text" required />
          </FormControl>
        </FormField>
        <FormField name="password">
          <FormLabel>Password</FormLabel>
          <FormControl asChild>
            <Input type="password" required />
          </FormControl>
          <FormMessage match="valueMissing">
            Please enter your password
          </FormMessage>
          <FormMessage match="tooLong">
            Password must not be beyond 400 characters long
          </FormMessage>
        </FormField>
        <FormSubmit>Log in</FormSubmit>
      </FormRoot>
      {/* <form action={login}>
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <button>Continue</button>
      </form> */}
    </div>
  );
}
