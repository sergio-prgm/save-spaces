# Instructions to build a shadcn-inspired form with form actions in next

## Reasons to use this component (instead of shadcn's form)

While shadcn's form component is great on its own, it uses react-hook-form and client-side validation and form-handling.
There is nothing inherently wrong with this approach, though, it is not compatible with next's and react's new models of server actions and components.

This component aims to be a thin wrapper over the existing radix-ui components, providing minimal styling and great composability/extensibility (like all shadcn's components).

## Steps

### Install nextjs via [create-t3-app](https://create.t3.gg/)

```sh
pnpm create t3-app@latest
# Select tailwind, drizzle, and app router options
```

### Install shadui and the necessary components

```sh
pnpm dlx shadcn-ui@latest init

✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Would you like to use CSS variables for colors? › no
```

```sh
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add label
pnpm dlx shadcn-ui@latest add radio-group
pnpm dlx shadcn-ui@latest add textarea
# Add anything else needed for the form
```

This will install all the necessary dependencies for using the basic components from shadcn (mainly, radix-ui related components)

Once every necessary comopnent is installed, we can get to building the component itself.

> [!note] Note
> The component can be built at any time and it can contain any type of form element required. The proposed order of operations is a mere logical bundling of actions to take.

### Build the component

In a `components/ui` folder (it should have already been created by shadcn) create a new `form.tsx` file with the following contents:

```tsx
"use client";
```
