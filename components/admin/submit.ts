import { startTransition, type FormEvent } from "react";

/**
 * onSubmit handler for a form whose `action` comes from useActionState. React resets a form once its
 * action has run, even when it returns an error; dispatching from onSubmit keeps what was typed.
 * The form keeps its `action` prop, used for submissions made before hydration.
 */
export function keepValuesOnSubmit(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget, (event.nativeEvent as SubmitEvent).submitter);
    startTransition(() => dispatch(formData));
  };
}
