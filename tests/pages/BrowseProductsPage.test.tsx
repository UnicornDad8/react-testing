import { Theme } from "@radix-ui/themes";
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { server } from '../mocks/server';
import { http, delay, HttpResponse } from "msw";
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { db } from "../mocks/db";
import { Category } from "../../src/entities";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(db.category.create());
    })
  });

  afterAll(() => {
    const categoryIds = categories.map(c => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds }}});
  });

  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
      );
  };

  it("should show a loading skeleton when fetching categories", () => {
    server.use(http.get("/categories", async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    renderComponent();

    expect(screen.getByRole('progressbar', { name: /categories/i})).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar", { name: /categories/i}));
  });

  it("should show a loading skeleton when fetching products", () => {
    server.use(http.get("/products", async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    renderComponent();

    expect(screen.getByRole('progressbar', { name: /products/i})).toBeInTheDocument();
  });
  
  it("should hide the loading skeleton after products are fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar", { name: /products/i}));
  });

  it("should not render an error if categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar", { name: /categories/i }))

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: /category/i })).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach(category => {
      expect(screen.getByRole("option", { name: category.name })).toBeInTheDocument();
    })
  });
});