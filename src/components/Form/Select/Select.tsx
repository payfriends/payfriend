import { type ComponentPropsWithRef, forwardRef } from "react";
import cs from "$/utils/cs";
import Label, { type LabelProps } from "$/components/Form/Label/Label";

type Props = ComponentPropsWithRef<"select"> & Omit<LabelProps, "children">;

// eslint-disable-next-line react/display-name
const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, className, description, error, warning, ...props }, ref) => (
    <Label
      required={props.required}
      description={description}
      label={label}
      error={error}
      warning={warning}
    >
      <select
        {...props}
        ref={ref}
        className={cs(
          "dark:border-dim-50 dark:bg-dim-50 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none dark:text-gray-100 dark:focus:border-indigo-400",
          className
        )}
      />
    </Label>
  )
);

export default Select;
