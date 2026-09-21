import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isStudentHelpArea,
  STUDENT_SUPPORT_PATHS,
  SUPPORT_PATHS,
  supportActionAudienceFor,
  supportPathsFor,
} from "./paths.ts";

describe("supportPathsFor", () => {
  it("uses /ajuda for guardian and supervision", () => {
    assert.equal(supportPathsFor("/").home, SUPPORT_PATHS.home);
    assert.equal(supportPathsFor("/ajuda").home, "/ajuda");
    assert.equal(
      supportPathsFor("/aluno/supervisao/child-ref").home,
      "/ajuda"
    );
    assert.equal(
      supportPathsFor("/aluno/supervisao/child-ref/materiais").home,
      "/ajuda"
    );
  });

  it("uses /aluno/ajuda for the student area", () => {
    assert.equal(supportPathsFor("/aluno").home, STUDENT_SUPPORT_PATHS.home);
    assert.equal(supportPathsFor("/aluno/materiais").home, "/aluno/ajuda");
    assert.equal(
      supportPathsFor("/aluno/ajuda/topicos/abc").faq("t1", "f1"),
      "/aluno/ajuda/topicos/t1/faqs/f1"
    );
  });
});

describe("isStudentHelpArea / audience", () => {
  it("treats student routes as student audience except supervision", () => {
    assert.equal(isStudentHelpArea("/aluno"), true);
    assert.equal(isStudentHelpArea("/aluno/ajuda"), true);
    assert.equal(isStudentHelpArea("/aluno/supervisao/x"), false);
    assert.equal(supportActionAudienceFor("/aluno"), "student");
    assert.equal(supportActionAudienceFor("/"), "guardian");
    assert.equal(supportActionAudienceFor("/aluno/supervisao/x"), "guardian");
  });
});
