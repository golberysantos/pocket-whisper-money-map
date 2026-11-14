import { describe, expect, test } from "bun:test";
import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER, whatsappUrl } from "./config";

describe("contato comercial", () => {
  test("usa exatamente o número informado pelo responsável", () => {
    expect(WHATSAPP_NUMBER).toBe("559291147485");
    expect(new URL(whatsappUrl()).pathname).toBe("/559291147485");
  });

  test("o link contém somente a mensagem genérica, sem dados do lead", () => {
    const url = new URL(whatsappUrl());
    expect([...url.searchParams.keys()]).toEqual(["text"]);
    expect(url.searchParams.get("text")).toBe(WHATSAPP_MESSAGE);
  });
});