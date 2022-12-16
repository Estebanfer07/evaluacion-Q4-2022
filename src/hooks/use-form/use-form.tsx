import { ChangeEvent, useState } from "react";
import {
  UseFormProps,
  FormErrors,
  FormValues,
  UseFormReturn,
} from "./use-form.interfaces";

export const useForm = (initState: UseFormProps): UseFormReturn => {
  const initialValues: FormValues = Object.keys(initState).reduce(
    (prev, currKey) => {
      return { ...prev, [currKey]: initState[currKey].value };
    },
    {}
  );
  const initialErrors: FormErrors = Object.keys(initState).reduce(
    (prev, currKey) => {
      return { ...prev, [currKey]: [] };
    },
    {}
  );
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>(initialErrors);

  const checkErrors = (target: { name: string; value: string | number }) => {
    const errors = initState[target.name].validators.reduce<string[]>(
      (prev, curr) => {
        const error = curr(target.value.toString());
        if (error.length > 0) return [...prev, error];
        return [...prev];
      },
      []
    );

    setFormErrors((prev) => ({
      ...prev,
      [target.name]: errors,
    }));
    return errors;
  };

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [target.name]: target.value,
    }));
    checkErrors({ name: target.name, value: target.value });
  };

  const resetForm = (customValues?: FormValues) => {
    setFormData({ ...(customValues ? customValues : initialValues) });
    setFormErrors({ ...initialErrors });
  };

  const isValidForm = () => {
    return Object.keys(formData).reduce<boolean>((prev, currKey) => {
      const errors = checkErrors({ name: currKey, value: formData[currKey] });
      return prev && errors.length == 0;
    }, true);
  };

  return {
    form: formData,
    formErrors,
    onChange,
    resetForm,
    setFormErrors,
    isValidForm,
  };
};
