import { render, screen } from '@testing-library/react';
import Label from '../../src/components/Label';
import { LanguageProvider } from '../../src/providers/language/LanguageProvider';
import { Language } from '../../src/providers/language/type';

describe("Label", () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  }

  describe("Given the current language is EN", () => {
    it.each([
      { labelId: "welcome", text: /welcome/i },
      { labelId: "new_product", text: /new product/i },
      { labelId: "edit_product", text: /edit product/i }
    ])("should render $text for $labelId", ({ labelId, text }) => {
      renderComponent(labelId, "en");
  
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe("Given the current language is ES", () => {
    it.each([
      { labelId: "welcome", text: /bienvenidos/i },
      { labelId: "new_product", text: /nuevo producto/i },
      { labelId: "edit_product", text: /editar producto/i }
    ])("should render $text for $labelId", ({ labelId, text }) => {
      renderComponent(labelId, "es");
  
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("should throw an error if given an invalid labelId", () => {
    expect(() => renderComponent("!", "en")).toThrowError();
  });
});