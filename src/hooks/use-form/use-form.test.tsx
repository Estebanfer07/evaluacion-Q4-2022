import { renderHook, act } from "@testing-library/react-hooks";
import { required } from "../../utils/functions/validation-helper/validation-helper";
import { useForm } from "./use-form";
import { UseFormReturn, UseFormProps } from "./use-form.interfaces";

const formMock: UseFormProps = {
  normal: {
    value: "123",
    validators: [required],
  },
  check: {
    value: "false",
    validators: [],
  },
  options: {
    type: "multiselect",
    value: "",
    validators: [],
  },
};

describe("useForm", () => {
  const { result } = renderHook<any, UseFormReturn>(() => useForm(formMock));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("should initialize useForm", () => {
    expect(result.current.form["normal"]).toBe("123");
  });

  it("should check if form is valid", () => {
    let valid = false;
    act(() => {
      valid = result.current.isValidForm();
    });
    expect(valid).toBeTruthy();
  });
  it("should check if form has errors", () => {
    let valid = true;

    act(() => {
      result.current.onChange({
        target: { name: "normal", value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      valid = result.current.isValidForm();
    });
    expect(valid).toBeFalsy();
    expect(result.current.formErrors["normal"].length).toBeGreaterThan(0);
  });
  it("should reset form", () => {
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.form).toEqual({
      normal: "123",
      options: "",
      check: "false",
    });
  });
});
