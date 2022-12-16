import {
  act,
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { AxiosResponse } from "axios";
import { Provider } from "react-redux";
import * as service from "../../../services/gif-service/gif-service";
import { store } from "../../../store/store";
import { GalleryPage } from "./gallery-page";
import * as actions from "../../../store/actions/actions";
import { Gif } from "../../../utils/interfaces/gif.interface";

describe("GalleryPage", () => {
  const WrappedComponent = () => {
    return (
      <Provider store={store}>
        <GalleryPage />
      </Provider>
    );
  };

  let mocketGetGifs: jest.SpyInstance<Promise<AxiosResponse<Gif[], any>>, []>;

  beforeAll(() => {
    mocketGetGifs = jest.spyOn(service, "getGifs");
  });

  it("should render Loading Gallery page", () => {
    mocketGetGifs.mockImplementation(() =>
      Promise.resolve({ data: [] } as AxiosResponse)
    );
    render(<WrappedComponent />);

    const title = screen.queryByText("Loading", { exact: false });
    expect(title).not.toBeNull();
  });

  it("should render empty Gallery page", async () => {
    mocketGetGifs.mockImplementation(() =>
      Promise.resolve({ data: [] } as AxiosResponse)
    );

    render(<WrappedComponent />);

    await act(async () => {});

    const title = screen.queryByText("No posee gifs");

    expect(title).not.toBeNull();
  });

  it("should render Gallery page with gifs", async () => {
    mocketGetGifs.mockImplementation(() =>
      Promise.resolve({
        data: [{ id: 1, url: "http:...", author_id: 17 }],
      } as AxiosResponse)
    );

    render(<WrappedComponent />);
    await act(async () => {});

    const items = screen.queryAllByAltText("http:...");

    expect(items.length).toBe(1);
  });

  it("should not call addGif action if form is not valid", async () => {
    mocketGetGifs.mockImplementation(() =>
      Promise.resolve({ data: [] } as AxiosResponse)
    );
    const addGifAction = jest.spyOn(actions, "startAddingGif");

    render(<WrappedComponent />);
    await act(async () => {});

    const input = screen.queryByPlaceholderText("GIF URL");
    expect(input).not.toBeNull();

    const addBtn = screen.queryByText("Agregar");
    expect(addBtn).not.toBeNull();

    fireEvent.click(addBtn!);
    expect(addGifAction).not.toHaveBeenCalled();
  });

  it("should call addGif action if form is valid", async () => {
    jest.useFakeTimers();
    mocketGetGifs.mockResolvedValue({
      data: [],
    } as AxiosResponse);
    const addGifAction = jest
      .spyOn(actions, "startAddingGif")
      .mockImplementation(() => jest.fn());

    render(<WrappedComponent />);
    await act(async () => {});

    const input = screen.getByPlaceholderText<HTMLInputElement>("GIF URL");
    expect(input).not.toBeNull();

    await act(async () => {
      fireEvent.change(input!, {
        // target: { value: "http://wwww.google.com" },
        target: { value: "a" },
      });
      input.value = "http://wwww.google.com";
    });

    const addBtn = screen.queryByText("Agregar");
    expect(addBtn).not.toBeNull();

    fireEvent.click(addBtn!);
    expect(addGifAction).toHaveBeenCalled();
  });
});
