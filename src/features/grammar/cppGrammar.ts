// cpp-syntax-diagrams.ts
//
// ES module that defines the C++ grammar as railroad diagrams.
// Based on the C++ Standard Grammar Summary (Annex A).
// Many rules are rendered in diagram-friendly equivalent form.

import * as RR from "@prantlf/railroad-diagrams/lib/index.mjs";

// Convenience wrappers
function callOrNew(Ctor: any, ...args: any[]): any {
  try {
    return Ctor(...args);
  } catch (e: any) {
    if (e instanceof TypeError && /without 'new'/.test(e.message)) {
      return new Ctor(...args);
    }
    throw e;
  }
}

// Wrapped primitives
const Diagram    = (...a: any[]) => callOrNew(RR.Diagram, ...a);
const Sequence   = (...a: any[]) => callOrNew(RR.Sequence, ...a);
const Choice     = (...a: any[]) => callOrNew(RR.Choice, ...a);
const Optional   = (...a: any[]) => callOrNew(RR.Optional, ...a);
const OneOrMore  = (...a: any[]) => callOrNew(RR.OneOrMore, ...a);
const ZeroOrMore = (...a: any[]) => callOrNew(RR.ZeroOrMore, ...a);
const Terminal   = (...a: any[]) => callOrNew(RR.Terminal, ...a);
const NonTerminal = (...a: any[]) => callOrNew(RR.NonTerminal, ...a);
const Stack      = (...a: any[]) => callOrNew(RR.Stack, ...a);
const Comment    = (...a: any[]) => callOrNew(RR.Comment, ...a);

const T  = (s: string) => Terminal(s);
const NT = (s: string) => NonTerminal(s);
const K  = (s: string) => Terminal(s); // Keyword

// --- Grammar rules (diagram factories) ----------------------------------------

const rules = new Map<string, () => any>();

// ===== A.2 Keywords [gram.key] =====

rules.set("typedef-name", () =>
  Diagram(
    Choice(0,
      NT("identifier"),
      NT("simple-template-id")
    )
  )
);

rules.set("namespace-name", () =>
  Diagram(
    Choice(0,
      NT("identifier"),
      NT("namespace-alias")
    )
  )
);

rules.set("namespace-alias", () =>
  Diagram(NT("identifier"))
);

rules.set("class-name", () =>
  Diagram(
    Choice(0,
      NT("identifier"),
      NT("simple-template-id")
    )
  )
);

rules.set("enum-name", () =>
  Diagram(NT("identifier"))
);

rules.set("template-name", () =>
  Diagram(NT("identifier"))
);

// ===== A.3 Lexical conventions [gram.lex] =====

rules.set("n-char", () =>
  Diagram(Comment("any char except } or new-line"))
);

rules.set("n-char-sequence", () =>
  Diagram(OneOrMore(NT("n-char")))
);

rules.set("named-universal-character", () =>
  Diagram(
    Sequence(T("\\N{"), NT("n-char-sequence"), T("}"))
  )
);

rules.set("hex-quad", () =>
  Diagram(
    Sequence(
      NT("hexadecimal-digit"),
      NT("hexadecimal-digit"),
      NT("hexadecimal-digit"),
      NT("hexadecimal-digit")
    )
  )
);

rules.set("simple-hexadecimal-digit-sequence", () =>
  Diagram(OneOrMore(NT("hexadecimal-digit")))
);

rules.set("universal-character-name", () =>
  Diagram(
    Choice(0,
      Sequence(T("\\u"), NT("hex-quad")),
      Sequence(T("\\U"), NT("hex-quad"), NT("hex-quad")),
      Sequence(T("\\u{"), NT("simple-hexadecimal-digit-sequence"), T("}")),
      NT("named-universal-character")
    )
  )
);

rules.set("preprocessing-token", () =>
  Diagram(
    Choice(0,
      NT("header-name"),
      NT("import-keyword"),
      NT("module-keyword"),
      NT("export-keyword"),
      NT("identifier"),
      NT("pp-number"),
      NT("character-literal"),
      NT("user-defined-character-literal"),
      NT("string-literal"),
      NT("user-defined-string-literal"),
      NT("preprocessing-op-or-punc"),
      Comment("non-whitespace char")
    )
  )
);

rules.set("token", () =>
  Diagram(
    Choice(0,
      NT("identifier"),
      NT("keyword"),
      NT("literal"),
      NT("operator-or-punctuator")
    )
  )
);

rules.set("header-name", () =>
  Diagram(
    Choice(0,
      Sequence(T("<"), NT("h-char-sequence"), T(">")),
      Sequence(T('"'), NT("q-char-sequence"), T('"'))
    )
  )
);

rules.set("h-char-sequence", () =>
  Diagram(OneOrMore(NT("h-char")))
);

rules.set("h-char", () =>
  Diagram(Comment("any char except new-line or >"))
);

rules.set("q-char-sequence", () =>
  Diagram(OneOrMore(NT("q-char")))
);

rules.set("q-char", () =>
  Diagram(Comment('any char except new-line or "'))
);

rules.set("pp-number", () =>
  Diagram(
    Sequence(
      Choice(0, NT("digit"), Sequence(T("."), NT("digit"))),
      ZeroOrMore(
        Choice(0,
          NT("identifier-continue"),
          Sequence(T("'"), NT("digit")),
          Sequence(T("'"), NT("nondigit")),
          Sequence(Choice(0, T("e"), T("E"), T("p"), T("P")), NT("sign")),
          T(".")
        )
      )
    )
  )
);

rules.set("identifier", () =>
  Diagram(
    Sequence(
      NT("identifier-start"),
      ZeroOrMore(NT("identifier-continue"))
    )
  )
);

rules.set("identifier-start", () =>
  Diagram(
    Choice(0,
      NT("nondigit"),
      Comment("Unicode XID_Start")
    )
  )
);

rules.set("identifier-continue", () =>
  Diagram(
    Choice(0,
      NT("digit"),
      NT("nondigit"),
      Comment("Unicode XID_Continue")
    )
  )
);

rules.set("nondigit", () =>
  Diagram(
    Choice(0,
      T("a-z"), T("A-Z"), T("_")
    )
  )
);

rules.set("digit", () =>
  Diagram(
    Choice(0, T("0"), T("1"), T("2"), T("3"), T("4"), T("5"), T("6"), T("7"), T("8"), T("9"))
  )
);

rules.set("keyword", () =>
  Diagram(
    Choice(0,
      Comment("any identifier in Table 5"),
      NT("import-keyword"),
      NT("module-keyword"),
      NT("export-keyword")
    )
  )
);

rules.set("preprocessing-op-or-punc", () =>
  Diagram(
    Choice(0,
      NT("preprocessing-operator"),
      NT("operator-or-punctuator")
    )
  )
);

rules.set("preprocessing-operator", () =>
  Diagram(
    Choice(0, T("#"), T("##"), T("%:"), T("%:%:"))
  )
);

rules.set("operator-or-punctuator", () =>
  Diagram(
    Choice(0,
      T("{"), T("}"), T("["), T("]"), T("("), T(")"),
      T("<:"), T(":>"), T("<%"), T("%>"), T(";"), T(":"), T("..."),
      T("?"), T("::"), T("."), T(".*"), T("->"), T("->*"), T("~"),
      T("!"), T("+"), T("-"), T("*"), T("/"), T("%"), T("^"), T("&"), T("|"),
      T("="), T("+="), T("-="), T("*="), T("/="), T("%="), T("^="), T("&="), T("|="),
      T("=="), T("!="), T("<"), T(">"), T("<="), T(">="), T("<=>"), T("&&"), T("||"),
      T("<<"), T(">>"), T("<<="), T(">>="), T("++"), T("--"), T(","),
      K("and"), K("or"), K("xor"), K("not"), K("bitand"), K("bitor"), K("compl"),
      K("and_eq"), K("or_eq"), K("xor_eq"), K("not_eq")
    )
  )
);

rules.set("literal", () =>
  Diagram(
    Choice(0,
      NT("integer-literal"),
      NT("character-literal"),
      NT("floating-point-literal"),
      NT("string-literal"),
      NT("boolean-literal"),
      NT("pointer-literal"),
      NT("user-defined-literal")
    )
  )
);

rules.set("integer-literal", () =>
  Diagram(
    Sequence(
      Choice(0,
        NT("binary-literal"),
        NT("octal-literal"),
        NT("decimal-literal"),
        NT("hexadecimal-literal")
      ),
      Optional(NT("integer-suffix"))
    )
  )
);

rules.set("binary-literal", () =>
  Diagram(
    Sequence(
      Choice(0, T("0b"), T("0B")),
      NT("binary-digit"),
      ZeroOrMore(Sequence(Optional(T("'")), NT("binary-digit")))
    )
  )
);

rules.set("octal-literal", () =>
  Diagram(
    Choice(0,
      T("0"),
      Sequence(T("0"), OneOrMore(Sequence(Optional(T("'")), NT("octal-digit"))))
    )
  )
);

rules.set("decimal-literal", () =>
  Diagram(
    Sequence(
      NT("nonzero-digit"),
      ZeroOrMore(Sequence(Optional(T("'")), NT("digit")))
    )
  )
);

rules.set("hexadecimal-literal", () =>
  Diagram(
    Sequence(NT("hexadecimal-prefix"), NT("hexadecimal-digit-sequence"))
  )
);

rules.set("binary-digit", () =>
  Diagram(Choice(0, T("0"), T("1")))
);

rules.set("octal-digit", () =>
  Diagram(Choice(0, T("0"), T("1"), T("2"), T("3"), T("4"), T("5"), T("6"), T("7")))
);

rules.set("nonzero-digit", () =>
  Diagram(Choice(0, T("1"), T("2"), T("3"), T("4"), T("5"), T("6"), T("7"), T("8"), T("9")))
);

rules.set("hexadecimal-prefix", () =>
  Diagram(Choice(0, T("0x"), T("0X")))
);

rules.set("hexadecimal-digit-sequence", () =>
  Diagram(
    Sequence(
      NT("hexadecimal-digit"),
      ZeroOrMore(Sequence(Optional(T("'")), NT("hexadecimal-digit")))
    )
  )
);

rules.set("hexadecimal-digit", () =>
  Diagram(
    Choice(0,
      T("0"), T("1"), T("2"), T("3"), T("4"), T("5"), T("6"), T("7"), T("8"), T("9"),
      T("a"), T("b"), T("c"), T("d"), T("e"), T("f"),
      T("A"), T("B"), T("C"), T("D"), T("E"), T("F")
    )
  )
);

rules.set("integer-suffix", () =>
  Diagram(
    Choice(0,
      Sequence(NT("unsigned-suffix"), Optional(Choice(0, NT("long-suffix"), NT("long-long-suffix"), NT("size-suffix")))),
      Sequence(NT("long-suffix"), Optional(NT("unsigned-suffix"))),
      Sequence(NT("long-long-suffix"), Optional(NT("unsigned-suffix"))),
      Sequence(NT("size-suffix"), Optional(NT("unsigned-suffix")))
    )
  )
);

rules.set("unsigned-suffix", () =>
  Diagram(Choice(0, T("u"), T("U")))
);

rules.set("long-suffix", () =>
  Diagram(Choice(0, T("l"), T("L")))
);

rules.set("long-long-suffix", () =>
  Diagram(Choice(0, T("ll"), T("LL")))
);

rules.set("size-suffix", () =>
  Diagram(Choice(0, T("z"), T("Z")))
);

rules.set("character-literal", () =>
  Diagram(
    Sequence(
      Optional(NT("encoding-prefix")),
      T("'"),
      NT("c-char-sequence"),
      T("'")
    )
  )
);

rules.set("encoding-prefix", () =>
  Diagram(Choice(0, T("u8"), T("u"), T("U"), T("L")))
);

rules.set("c-char-sequence", () =>
  Diagram(OneOrMore(NT("c-char")))
);

rules.set("c-char", () =>
  Diagram(
    Choice(0,
      NT("basic-c-char"),
      NT("escape-sequence"),
      NT("universal-character-name")
    )
  )
);

rules.set("basic-c-char", () =>
  Diagram(Comment("any char except ', \\, or new-line"))
);

rules.set("escape-sequence", () =>
  Diagram(
    Choice(0,
      NT("simple-escape-sequence"),
      NT("numeric-escape-sequence"),
      NT("conditional-escape-sequence")
    )
  )
);

rules.set("simple-escape-sequence", () =>
  Diagram(
    Sequence(T("\\"), NT("simple-escape-sequence-char"))
  )
);

rules.set("simple-escape-sequence-char", () =>
  Diagram(
    Choice(0, T("'"), T('"'), T("?"), T("\\"), T("a"), T("b"), T("f"), T("n"), T("r"), T("t"), T("v"))
  )
);

rules.set("numeric-escape-sequence", () =>
  Diagram(
    Choice(0,
      NT("octal-escape-sequence"),
      NT("hexadecimal-escape-sequence")
    )
  )
);

rules.set("simple-octal-digit-sequence", () =>
  Diagram(OneOrMore(NT("octal-digit")))
);

rules.set("octal-escape-sequence", () =>
  Diagram(
    Choice(0,
      Sequence(T("\\"), NT("octal-digit")),
      Sequence(T("\\"), NT("octal-digit"), NT("octal-digit")),
      Sequence(T("\\"), NT("octal-digit"), NT("octal-digit"), NT("octal-digit")),
      Sequence(T("\\o{"), NT("simple-octal-digit-sequence"), T("}"))
    )
  )
);

rules.set("hexadecimal-escape-sequence", () =>
  Diagram(
    Choice(0,
      Sequence(T("\\x"), NT("simple-hexadecimal-digit-sequence")),
      Sequence(T("\\x{"), NT("simple-hexadecimal-digit-sequence"), T("}"))
    )
  )
);

rules.set("conditional-escape-sequence", () =>
  Diagram(
    Sequence(T("\\"), NT("conditional-escape-sequence-char"))
  )
);

rules.set("conditional-escape-sequence-char", () =>
  Diagram(Comment("basic char not octal/escape/N/o/u/U/x"))
);

rules.set("floating-point-literal", () =>
  Diagram(
    Choice(0,
      NT("decimal-floating-point-literal"),
      NT("hexadecimal-floating-point-literal")
    )
  )
);

rules.set("decimal-floating-point-literal", () =>
  Diagram(
    Choice(0,
      Sequence(NT("fractional-constant"), Optional(NT("exponent-part")), Optional(NT("floating-point-suffix"))),
      Sequence(NT("digit-sequence"), NT("exponent-part"), Optional(NT("floating-point-suffix")))
    )
  )
);

rules.set("hexadecimal-floating-point-literal", () =>
  Diagram(
    Choice(0,
      Sequence(NT("hexadecimal-prefix"), NT("hexadecimal-fractional-constant"), NT("binary-exponent-part"), Optional(NT("floating-point-suffix"))),
      Sequence(NT("hexadecimal-prefix"), NT("hexadecimal-digit-sequence"), NT("binary-exponent-part"), Optional(NT("floating-point-suffix")))
    )
  )
);

rules.set("fractional-constant", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("digit-sequence")), T("."), NT("digit-sequence")),
      Sequence(NT("digit-sequence"), T("."))
    )
  )
);

rules.set("hexadecimal-fractional-constant", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("hexadecimal-digit-sequence")), T("."), NT("hexadecimal-digit-sequence")),
      Sequence(NT("hexadecimal-digit-sequence"), T("."))
    )
  )
);

rules.set("exponent-part", () =>
  Diagram(
    Sequence(Choice(0, T("e"), T("E")), Optional(NT("sign")), NT("digit-sequence"))
  )
);

rules.set("binary-exponent-part", () =>
  Diagram(
    Sequence(Choice(0, T("p"), T("P")), Optional(NT("sign")), NT("digit-sequence"))
  )
);

rules.set("sign", () =>
  Diagram(Choice(0, T("+"), T("-")))
);

rules.set("digit-sequence", () =>
  Diagram(
    Sequence(NT("digit"), ZeroOrMore(Sequence(Optional(T("'")), NT("digit"))))
  )
);

rules.set("floating-point-suffix", () =>
  Diagram(
    Choice(0,
      T("f"), T("l"), T("f16"), T("f32"), T("f64"), T("f128"), T("bf16"),
      T("F"), T("L"), T("F16"), T("F32"), T("F64"), T("F128"), T("BF16")
    )
  )
);

rules.set("string-literal", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("encoding-prefix")), T('"'), Optional(NT("s-char-sequence")), T('"')),
      Sequence(Optional(NT("encoding-prefix")), T("R"), NT("raw-string"))
    )
  )
);

rules.set("s-char-sequence", () =>
  Diagram(OneOrMore(NT("s-char")))
);

rules.set("s-char", () =>
  Diagram(
    Choice(0,
      NT("basic-s-char"),
      NT("escape-sequence"),
      NT("universal-character-name")
    )
  )
);

rules.set("basic-s-char", () =>
  Diagram(Comment('any char except ", \\, or new-line'))
);

rules.set("raw-string", () =>
  Diagram(
    Sequence(
      T('"'),
      Optional(NT("d-char-sequence")),
      T("("),
      Optional(NT("r-char-sequence")),
      T(")"),
      Optional(NT("d-char-sequence")),
      T('"')
    )
  )
);

rules.set("r-char-sequence", () =>
  Diagram(OneOrMore(NT("r-char")))
);

rules.set("r-char", () =>
  Diagram(Comment("any char except ) + d-char-seq + \""))
);

rules.set("d-char-sequence", () =>
  Diagram(OneOrMore(NT("d-char")))
);

rules.set("d-char", () =>
  Diagram(Comment("basic char except space/parens/\\/tabs/newline"))
);

rules.set("boolean-literal", () =>
  Diagram(Choice(0, K("false"), K("true")))
);

rules.set("pointer-literal", () =>
  Diagram(K("nullptr"))
);

rules.set("user-defined-literal", () =>
  Diagram(
    Choice(0,
      NT("user-defined-integer-literal"),
      NT("user-defined-floating-point-literal"),
      NT("user-defined-string-literal"),
      NT("user-defined-character-literal")
    )
  )
);

rules.set("user-defined-integer-literal", () =>
  Diagram(
    Sequence(
      Choice(0, NT("decimal-literal"), NT("octal-literal"), NT("hexadecimal-literal"), NT("binary-literal")),
      NT("ud-suffix")
    )
  )
);

rules.set("user-defined-floating-point-literal", () =>
  Diagram(
    Choice(0,
      Sequence(NT("fractional-constant"), Optional(NT("exponent-part")), NT("ud-suffix")),
      Sequence(NT("digit-sequence"), NT("exponent-part"), NT("ud-suffix")),
      Sequence(NT("hexadecimal-prefix"), NT("hexadecimal-fractional-constant"), NT("binary-exponent-part"), NT("ud-suffix")),
      Sequence(NT("hexadecimal-prefix"), NT("hexadecimal-digit-sequence"), NT("binary-exponent-part"), NT("ud-suffix"))
    )
  )
);

rules.set("user-defined-string-literal", () =>
  Diagram(Sequence(NT("string-literal"), NT("ud-suffix")))
);

rules.set("user-defined-character-literal", () =>
  Diagram(Sequence(NT("character-literal"), NT("ud-suffix")))
);

rules.set("ud-suffix", () =>
  Diagram(NT("identifier"))
);

// ===== A.4 Basics [gram.basic] =====

rules.set("translation-unit", () =>
  Diagram(
    Choice(0,
      Optional(NT("declaration-seq")),
      Sequence(
        Optional(NT("global-module-fragment")),
        NT("module-declaration"),
        Optional(NT("declaration-seq")),
        Optional(NT("private-module-fragment"))
      )
    )
  )
);

// ===== A.5 Expressions [gram.expr] =====

rules.set("primary-expression", () =>
  Diagram(
    Choice(0,
      NT("literal"),
      K("this"),
      Sequence(T("("), NT("expression"), T(")")),
      NT("id-expression"),
      NT("lambda-expression"),
      NT("fold-expression"),
      NT("requires-expression")
    )
  )
);

rules.set("id-expression", () =>
  Diagram(
    Choice(0,
      NT("unqualified-id"),
      NT("qualified-id")
    )
  )
);

rules.set("unqualified-id", () =>
  Diagram(
    Choice(0,
      NT("identifier"),
      NT("operator-function-id"),
      NT("conversion-function-id"),
      NT("literal-operator-id"),
      Sequence(T("~"), NT("type-name")),
      Sequence(T("~"), NT("decltype-specifier")),
      NT("template-id")
    )
  )
);

rules.set("qualified-id", () =>
  Diagram(
    Sequence(NT("nested-name-specifier"), Optional(K("template")), NT("unqualified-id"))
  )
);

rules.set("nested-name-specifier", () =>
  Diagram(
    Sequence(
      Choice(0,
        T("::"),
        Sequence(NT("type-name"), T("::")),
        Sequence(NT("namespace-name"), T("::")),
        Sequence(NT("decltype-specifier"), T("::"))
      ),
      ZeroOrMore(
        Choice(0,
          Sequence(NT("identifier"), T("::")),
          Sequence(Optional(K("template")), NT("simple-template-id"), T("::"))
        )
      )
    )
  )
);

rules.set("lambda-expression", () =>
  Diagram(
    Choice(0,
      Sequence(NT("lambda-introducer"), Optional(NT("attribute-specifier-seq")), NT("lambda-declarator"), NT("compound-statement")),
      Sequence(
        NT("lambda-introducer"),
        T("<"),
        NT("template-parameter-list"),
        T(">"),
        Optional(NT("requires-clause")),
        Optional(NT("attribute-specifier-seq")),
        NT("lambda-declarator"),
        NT("compound-statement")
      )
    )
  )
);

rules.set("lambda-introducer", () =>
  Diagram(
    Sequence(T("["), Optional(NT("lambda-capture")), T("]"))
  )
);

rules.set("lambda-declarator", () =>
  Diagram(
    Choice(0,
      Sequence(NT("lambda-specifier-seq"), Optional(NT("noexcept-specifier")), Optional(NT("attribute-specifier-seq")), Optional(NT("trailing-return-type"))),
      Sequence(NT("noexcept-specifier"), Optional(NT("attribute-specifier-seq")), Optional(NT("trailing-return-type"))),
      Optional(NT("trailing-return-type")),
      Sequence(
        T("("),
        NT("parameter-declaration-clause"),
        T(")"),
        Optional(NT("lambda-specifier-seq")),
        Optional(NT("noexcept-specifier")),
        Optional(NT("attribute-specifier-seq")),
        Optional(NT("trailing-return-type")),
        Optional(NT("requires-clause"))
      )
    )
  )
);

rules.set("lambda-specifier", () =>
  Diagram(
    Choice(0, K("consteval"), K("constexpr"), K("mutable"), K("static"))
  )
);

rules.set("lambda-specifier-seq", () =>
  Diagram(OneOrMore(NT("lambda-specifier")))
);

rules.set("lambda-capture", () =>
  Diagram(
    Choice(0,
      NT("capture-default"),
      NT("capture-list"),
      Sequence(NT("capture-default"), T(","), NT("capture-list"))
    )
  )
);

rules.set("capture-default", () =>
  Diagram(Choice(0, T("&"), T("=")))
);

rules.set("capture-list", () =>
  Diagram(
    Sequence(NT("capture"), ZeroOrMore(Sequence(T(","), NT("capture"))))
  )
);

rules.set("capture", () =>
  Diagram(
    Choice(0,
      NT("simple-capture"),
      NT("init-capture")
    )
  )
);

rules.set("simple-capture", () =>
  Diagram(
    Choice(0,
      Sequence(NT("identifier"), Optional(T("..."))),
      Sequence(T("&"), NT("identifier"), Optional(T("..."))),
      K("this"),
      Sequence(T("*"), K("this"))
    )
  )
);

rules.set("init-capture", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(T("...")), NT("identifier"), NT("initializer")),
      Sequence(T("&"), Optional(T("...")), NT("identifier"), NT("initializer"))
    )
  )
);

rules.set("fold-expression", () =>
  Diagram(
    Choice(0,
      Sequence(T("("), NT("cast-expression"), NT("fold-operator"), T("..."), T(")")),
      Sequence(T("("), T("..."), NT("fold-operator"), NT("cast-expression"), T(")")),
      Sequence(T("("), NT("cast-expression"), NT("fold-operator"), T("..."), NT("fold-operator"), NT("cast-expression"), T(")"))
    )
  )
);

rules.set("fold-operator", () =>
  Diagram(
    Choice(0,
      T("+"), T("-"), T("*"), T("/"), T("%"), T("^"), T("&"), T("|"), T("<<"), T(">>"),
      T("+="), T("-="), T("*="), T("/="), T("%="), T("^="), T("&="), T("|="), T("<<="), T(">>="), T("="),
      T("=="), T("!="), T("<"), T(">"), T("<="), T(">="), T("&&"), T("||"), T(","), T(".*"), T("->*")
    )
  )
);

rules.set("requires-expression", () =>
  Diagram(
    Sequence(K("requires"), Optional(NT("requirement-parameter-list")), NT("requirement-body"))
  )
);

rules.set("requirement-parameter-list", () =>
  Diagram(
    Sequence(T("("), NT("parameter-declaration-clause"), T(")"))
  )
);

rules.set("requirement-body", () =>
  Diagram(
    Sequence(T("{"), NT("requirement-seq"), T("}"))
  )
);

rules.set("requirement-seq", () =>
  Diagram(OneOrMore(NT("requirement")))
);

rules.set("requirement", () =>
  Diagram(
    Choice(0,
      NT("simple-requirement"),
      NT("type-requirement"),
      NT("compound-requirement"),
      NT("nested-requirement")
    )
  )
);

rules.set("simple-requirement", () =>
  Diagram(Sequence(NT("expression"), T(";")))
);

rules.set("type-requirement", () =>
  Diagram(
    Sequence(K("typename"), Optional(NT("nested-name-specifier")), NT("type-name"), T(";"))
  )
);

rules.set("compound-requirement", () =>
  Diagram(
    Sequence(
      T("{"),
      NT("expression"),
      T("}"),
      Optional(K("noexcept")),
      Optional(NT("return-type-requirement")),
      T(";")
    )
  )
);

rules.set("return-type-requirement", () =>
  Diagram(Sequence(T("->"), NT("type-constraint")))
);

rules.set("nested-requirement", () =>
  Diagram(Sequence(K("requires"), NT("constraint-expression"), T(";")))
);

rules.set("postfix-expression", () =>
  Diagram(
    Choice(0,
      NT("primary-expression"),
      Sequence(NT("postfix-expression"), T("["), Optional(NT("expression-list")), T("]")),
      Sequence(NT("postfix-expression"), T("("), Optional(NT("expression-list")), T(")")),
      Sequence(NT("simple-type-specifier"), T("("), Optional(NT("expression-list")), T(")")),
      Sequence(NT("typename-specifier"), T("("), Optional(NT("expression-list")), T(")")),
      Sequence(NT("simple-type-specifier"), NT("braced-init-list")),
      Sequence(NT("typename-specifier"), NT("braced-init-list")),
      Sequence(NT("postfix-expression"), T("."), Optional(K("template")), NT("id-expression")),
      Sequence(NT("postfix-expression"), T("->"), Optional(K("template")), NT("id-expression")),
      Sequence(NT("postfix-expression"), T("++")),
      Sequence(NT("postfix-expression"), T("--")),
      Sequence(K("dynamic_cast"), T("<"), NT("type-id"), T(">"), T("("), NT("expression"), T(")")),
      Sequence(K("static_cast"), T("<"), NT("type-id"), T(">"), T("("), NT("expression"), T(")")),
      Sequence(K("reinterpret_cast"), T("<"), NT("type-id"), T(">"), T("("), NT("expression"), T(")")),
      Sequence(K("const_cast"), T("<"), NT("type-id"), T(">"), T("("), NT("expression"), T(")")),
      Sequence(K("typeid"), T("("), NT("expression"), T(")")),
      Sequence(K("typeid"), T("("), NT("type-id"), T(")"))
    )
  )
);

rules.set("expression-list", () =>
  Diagram(NT("initializer-list"))
);

rules.set("unary-expression", () =>
  Diagram(
    Choice(0,
      NT("postfix-expression"),
      Sequence(NT("unary-operator"), NT("cast-expression")),
      Sequence(T("++"), NT("cast-expression")),
      Sequence(T("--"), NT("cast-expression")),
      NT("await-expression"),
      Sequence(K("sizeof"), NT("unary-expression")),
      Sequence(K("sizeof"), T("("), NT("type-id"), T(")")),
      Sequence(K("sizeof"), T("..."), T("("), NT("identifier"), T(")")),
      Sequence(K("alignof"), T("("), NT("type-id"), T(")")),
      NT("noexcept-expression"),
      NT("new-expression"),
      NT("delete-expression")
    )
  )
);

rules.set("unary-operator", () =>
  Diagram(Choice(0, T("*"), T("&"), T("+"), T("-"), T("!"), T("~")))
);

rules.set("await-expression", () =>
  Diagram(Sequence(K("co_await"), NT("cast-expression")))
);

rules.set("noexcept-expression", () =>
  Diagram(Sequence(K("noexcept"), T("("), NT("expression"), T(")")))
);

rules.set("new-expression", () =>
  Diagram(
    Sequence(
      Optional(T("::")),
      K("new"),
      Optional(NT("new-placement")),
      Choice(0, NT("new-type-id"), Sequence(T("("), NT("type-id"), T(")"))),
      Optional(NT("new-initializer"))
    )
  )
);

rules.set("new-placement", () =>
  Diagram(Sequence(T("("), NT("expression-list"), T(")")))
);

rules.set("new-type-id", () =>
  Diagram(Sequence(NT("type-specifier-seq"), Optional(NT("new-declarator"))))
);

rules.set("new-declarator", () =>
  Diagram(
    Choice(0,
      Sequence(NT("ptr-operator"), Optional(NT("new-declarator"))),
      NT("noptr-new-declarator")
    )
  )
);

rules.set("noptr-new-declarator", () =>
  Diagram(
    Sequence(
      T("["),
      Optional(NT("expression")),
      T("]"),
      Optional(NT("attribute-specifier-seq")),
      ZeroOrMore(Sequence(T("["), NT("constant-expression"), T("]"), Optional(NT("attribute-specifier-seq"))))
    )
  )
);

rules.set("new-initializer", () =>
  Diagram(
    Choice(0,
      Sequence(T("("), Optional(NT("expression-list")), T(")")),
      NT("braced-init-list")
    )
  )
);

rules.set("delete-expression", () =>
  Diagram(
    Sequence(
      Optional(T("::")),
      K("delete"),
      Optional(Sequence(T("["), T("]"))),
      NT("cast-expression")
    )
  )
);

rules.set("cast-expression", () =>
  Diagram(
    Choice(0,
      NT("unary-expression"),
      Sequence(T("("), NT("type-id"), T(")"), NT("cast-expression"))
    )
  )
);

rules.set("pm-expression", () =>
  Diagram(
    Sequence(
      NT("cast-expression"),
      ZeroOrMore(Sequence(Choice(0, T(".*"), T("->*")), NT("cast-expression")))
    )
  )
);

rules.set("multiplicative-expression", () =>
  Diagram(
    Sequence(
      NT("pm-expression"),
      ZeroOrMore(Sequence(Choice(0, T("*"), T("/"), T("%")), NT("pm-expression")))
    )
  )
);

rules.set("additive-expression", () =>
  Diagram(
    Sequence(
      NT("multiplicative-expression"),
      ZeroOrMore(Sequence(Choice(0, T("+"), T("-")), NT("multiplicative-expression")))
    )
  )
);

rules.set("shift-expression", () =>
  Diagram(
    Sequence(
      NT("additive-expression"),
      ZeroOrMore(Sequence(Choice(0, T("<<"), T(">>")), NT("additive-expression")))
    )
  )
);

rules.set("compare-expression", () =>
  Diagram(
    Sequence(
      NT("shift-expression"),
      ZeroOrMore(Sequence(T("<=>"), NT("shift-expression")))
    )
  )
);

rules.set("relational-expression", () =>
  Diagram(
    Sequence(
      NT("compare-expression"),
      ZeroOrMore(Sequence(Choice(0, T("<"), T(">"), T("<="), T(">=")), NT("compare-expression")))
    )
  )
);

rules.set("equality-expression", () =>
  Diagram(
    Sequence(
      NT("relational-expression"),
      ZeroOrMore(Sequence(Choice(0, T("=="), T("!=")), NT("relational-expression")))
    )
  )
);

rules.set("and-expression", () =>
  Diagram(
    Sequence(
      NT("equality-expression"),
      ZeroOrMore(Sequence(T("&"), NT("equality-expression")))
    )
  )
);

rules.set("exclusive-or-expression", () =>
  Diagram(
    Sequence(
      NT("and-expression"),
      ZeroOrMore(Sequence(T("^"), NT("and-expression")))
    )
  )
);

rules.set("inclusive-or-expression", () =>
  Diagram(
    Sequence(
      NT("exclusive-or-expression"),
      ZeroOrMore(Sequence(T("|"), NT("exclusive-or-expression")))
    )
  )
);

rules.set("logical-and-expression", () =>
  Diagram(
    Sequence(
      NT("inclusive-or-expression"),
      ZeroOrMore(Sequence(T("&&"), NT("inclusive-or-expression")))
    )
  )
);

rules.set("logical-or-expression", () =>
  Diagram(
    Sequence(
      NT("logical-and-expression"),
      ZeroOrMore(Sequence(T("||"), NT("logical-and-expression")))
    )
  )
);

rules.set("conditional-expression", () =>
  Diagram(
    Choice(0,
      NT("logical-or-expression"),
      Sequence(NT("logical-or-expression"), T("?"), NT("expression"), T(":"), NT("assignment-expression"))
    )
  )
);

rules.set("yield-expression", () =>
  Diagram(
    Choice(0,
      Sequence(K("co_yield"), NT("assignment-expression")),
      Sequence(K("co_yield"), NT("braced-init-list"))
    )
  )
);

rules.set("throw-expression", () =>
  Diagram(Sequence(K("throw"), Optional(NT("assignment-expression"))))
);

rules.set("assignment-expression", () =>
  Diagram(
    Choice(0,
      NT("conditional-expression"),
      NT("yield-expression"),
      NT("throw-expression"),
      Sequence(NT("logical-or-expression"), NT("assignment-operator"), NT("initializer-clause"))
    )
  )
);

rules.set("assignment-operator", () =>
  Diagram(
    Choice(0,
      T("="), T("*="), T("/="), T("%="), T("+="), T("-="),
      T(">>="), T("<<="), T("&="), T("^="), T("|=")
    )
  )
);

rules.set("expression", () =>
  Diagram(
    Sequence(
      NT("assignment-expression"),
      ZeroOrMore(Sequence(T(","), NT("assignment-expression")))
    )
  )
);

rules.set("constant-expression", () =>
  Diagram(NT("conditional-expression"))
);

// ===== A.6 Statements [gram.stmt] =====

rules.set("statement", () =>
  Diagram(
    Choice(0,
      NT("labeled-statement"),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("expression-statement")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("compound-statement")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("selection-statement")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("iteration-statement")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("jump-statement")),
      NT("declaration-statement"),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("try-block"))
    )
  )
);

rules.set("init-statement", () =>
  Diagram(
    Choice(0,
      NT("expression-statement"),
      NT("simple-declaration"),
      NT("alias-declaration")
    )
  )
);

rules.set("condition", () =>
  Diagram(
    Choice(0,
      NT("expression"),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("decl-specifier-seq"), NT("declarator"), NT("brace-or-equal-initializer"))
    )
  )
);

rules.set("label", () =>
  Diagram(
    Sequence(
      Optional(NT("attribute-specifier-seq")),
      Choice(0,
        Sequence(NT("identifier"), T(":")),
        Sequence(K("case"), NT("constant-expression"), T(":")),
        Sequence(K("default"), T(":"))
      )
    )
  )
);

rules.set("labeled-statement", () =>
  Diagram(Sequence(NT("label"), NT("statement")))
);

rules.set("expression-statement", () =>
  Diagram(Sequence(Optional(NT("expression")), T(";")))
);

rules.set("compound-statement", () =>
  Diagram(
    Sequence(T("{"), Optional(NT("statement-seq")), Optional(NT("label-seq")), T("}"))
  )
);

rules.set("statement-seq", () =>
  Diagram(OneOrMore(NT("statement")))
);

rules.set("label-seq", () =>
  Diagram(OneOrMore(NT("label")))
);

rules.set("selection-statement", () =>
  Diagram(
    Choice(0,
      Sequence(K("if"), Optional(K("constexpr")), T("("), Optional(NT("init-statement")), NT("condition"), T(")"), NT("statement")),
      Sequence(K("if"), Optional(K("constexpr")), T("("), Optional(NT("init-statement")), NT("condition"), T(")"), NT("statement"), K("else"), NT("statement")),
      Sequence(K("if"), Optional(T("!")), K("consteval"), NT("compound-statement")),
      Sequence(K("if"), Optional(T("!")), K("consteval"), NT("compound-statement"), K("else"), NT("statement")),
      Sequence(K("switch"), T("("), Optional(NT("init-statement")), NT("condition"), T(")"), NT("statement"))
    )
  )
);

rules.set("iteration-statement", () =>
  Diagram(
    Choice(0,
      Sequence(K("while"), T("("), NT("condition"), T(")"), NT("statement")),
      Sequence(K("do"), NT("statement"), K("while"), T("("), NT("expression"), T(")"), T(";")),
      Sequence(K("for"), T("("), NT("init-statement"), Optional(NT("condition")), T(";"), Optional(NT("expression")), T(")"), NT("statement")),
      Sequence(K("for"), T("("), Optional(NT("init-statement")), NT("for-range-declaration"), T(":"), NT("for-range-initializer"), T(")"), NT("statement"))
    )
  )
);

rules.set("for-range-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("attribute-specifier-seq")), NT("decl-specifier-seq"), NT("declarator")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("decl-specifier-seq"), Optional(NT("ref-qualifier")), T("["), NT("identifier-list"), T("]"))
    )
  )
);

rules.set("for-range-initializer", () =>
  Diagram(NT("expr-or-braced-init-list"))
);

rules.set("jump-statement", () =>
  Diagram(
    Choice(0,
      Sequence(K("break"), T(";")),
      Sequence(K("continue"), T(";")),
      Sequence(K("return"), Optional(NT("expr-or-braced-init-list")), T(";")),
      NT("coroutine-return-statement"),
      Sequence(K("goto"), NT("identifier"), T(";"))
    )
  )
);

rules.set("coroutine-return-statement", () =>
  Diagram(Sequence(K("co_return"), Optional(NT("expr-or-braced-init-list")), T(";")))
);

rules.set("declaration-statement", () =>
  Diagram(NT("block-declaration"))
);

// ===== A.7 Declarations [gram.dcl] =====

rules.set("declaration-seq", () =>
  Diagram(OneOrMore(NT("declaration")))
);

rules.set("declaration", () =>
  Diagram(
    Choice(0,
      NT("name-declaration"),
      NT("special-declaration")
    )
  )
);

rules.set("name-declaration", () =>
  Diagram(
    Choice(0,
      NT("block-declaration"),
      NT("nodeclspec-function-declaration"),
      NT("function-definition"),
      NT("template-declaration"),
      NT("deduction-guide"),
      NT("linkage-specification"),
      NT("namespace-definition"),
      NT("empty-declaration"),
      NT("attribute-declaration"),
      NT("module-import-declaration")
    )
  )
);

rules.set("special-declaration", () =>
  Diagram(
    Choice(0,
      NT("explicit-instantiation"),
      NT("explicit-specialization"),
      NT("export-declaration")
    )
  )
);

rules.set("block-declaration", () =>
  Diagram(
    Choice(0,
      NT("simple-declaration"),
      NT("asm-declaration"),
      NT("namespace-alias-definition"),
      NT("using-declaration"),
      NT("using-enum-declaration"),
      NT("using-directive"),
      NT("static_assert-declaration"),
      NT("alias-declaration"),
      NT("opaque-enum-declaration")
    )
  )
);

rules.set("nodeclspec-function-declaration", () =>
  Diagram(
    Sequence(Optional(NT("attribute-specifier-seq")), NT("declarator"), T(";"))
  )
);

rules.set("alias-declaration", () =>
  Diagram(
    Sequence(K("using"), NT("identifier"), Optional(NT("attribute-specifier-seq")), T("="), NT("defining-type-id"), T(";"))
  )
);

rules.set("simple-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(NT("decl-specifier-seq"), Optional(NT("init-declarator-list")), T(";")),
      Sequence(NT("attribute-specifier-seq"), NT("decl-specifier-seq"), NT("init-declarator-list"), T(";")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("decl-specifier-seq"), Optional(NT("ref-qualifier")), T("["), NT("identifier-list"), T("]"), NT("initializer"), T(";"))
    )
  )
);

rules.set("static_assert-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(K("static_assert"), T("("), NT("constant-expression"), T(")"), T(";")),
      Sequence(K("static_assert"), T("("), NT("constant-expression"), T(","), NT("string-literal"), T(")"), T(";"))
    )
  )
);

rules.set("empty-declaration", () =>
  Diagram(T(";"))
);

rules.set("attribute-declaration", () =>
  Diagram(Sequence(NT("attribute-specifier-seq"), T(";")))
);

rules.set("decl-specifier", () =>
  Diagram(
    Choice(0,
      NT("storage-class-specifier"),
      NT("defining-type-specifier"),
      NT("function-specifier"),
      K("friend"),
      K("typedef"),
      K("constexpr"),
      K("consteval"),
      K("constinit"),
      K("inline")
    )
  )
);

rules.set("decl-specifier-seq", () =>
  Diagram(
    OneOrMore(Sequence(NT("decl-specifier"), Optional(NT("attribute-specifier-seq"))))
  )
);

rules.set("storage-class-specifier", () =>
  Diagram(
    Choice(0, K("static"), K("thread_local"), K("extern"), K("mutable"))
  )
);

rules.set("function-specifier", () =>
  Diagram(
    Choice(0, K("virtual"), NT("explicit-specifier"))
  )
);

rules.set("explicit-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(K("explicit"), T("("), NT("constant-expression"), T(")")),
      K("explicit")
    )
  )
);

rules.set("type-specifier", () =>
  Diagram(
    Choice(0,
      NT("simple-type-specifier"),
      NT("elaborated-type-specifier"),
      NT("typename-specifier"),
      NT("cv-qualifier")
    )
  )
);

rules.set("type-specifier-seq", () =>
  Diagram(
    OneOrMore(Sequence(NT("type-specifier"), Optional(NT("attribute-specifier-seq"))))
  )
);

rules.set("defining-type-specifier", () =>
  Diagram(
    Choice(0,
      NT("type-specifier"),
      NT("class-specifier"),
      NT("enum-specifier")
    )
  )
);

rules.set("defining-type-specifier-seq", () =>
  Diagram(
    OneOrMore(Sequence(NT("defining-type-specifier"), Optional(NT("attribute-specifier-seq"))))
  )
);

rules.set("simple-type-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("nested-name-specifier")), NT("type-name")),
      Sequence(NT("nested-name-specifier"), K("template"), NT("simple-template-id")),
      NT("decltype-specifier"),
      NT("placeholder-type-specifier"),
      Sequence(Optional(NT("nested-name-specifier")), NT("template-name")),
      K("char"), K("char8_t"), K("char16_t"), K("char32_t"), K("wchar_t"),
      K("bool"), K("short"), K("int"), K("long"), K("signed"), K("unsigned"),
      K("float"), K("double"), K("void")
    )
  )
);

rules.set("type-name", () =>
  Diagram(
    Choice(0,
      NT("class-name"),
      NT("enum-name"),
      NT("typedef-name")
    )
  )
);

rules.set("elaborated-type-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(NT("class-key"), Optional(NT("attribute-specifier-seq")), Optional(NT("nested-name-specifier")), NT("identifier")),
      Sequence(NT("class-key"), NT("simple-template-id")),
      Sequence(NT("class-key"), NT("nested-name-specifier"), Optional(K("template")), NT("simple-template-id")),
      Sequence(K("enum"), Optional(NT("nested-name-specifier")), NT("identifier"))
    )
  )
);

rules.set("decltype-specifier", () =>
  Diagram(
    Sequence(K("decltype"), T("("), NT("expression"), T(")"))
  )
);

rules.set("placeholder-type-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("type-constraint")), K("auto")),
      Sequence(Optional(NT("type-constraint")), K("decltype"), T("("), K("auto"), T(")"))
    )
  )
);

rules.set("init-declarator-list", () =>
  Diagram(
    Sequence(NT("init-declarator"), ZeroOrMore(Sequence(T(","), NT("init-declarator"))))
  )
);

rules.set("init-declarator", () =>
  Diagram(
    Choice(0,
      Sequence(NT("declarator"), Optional(NT("initializer"))),
      Sequence(NT("declarator"), NT("requires-clause"))
    )
  )
);

rules.set("declarator", () =>
  Diagram(
    Choice(0,
      NT("ptr-declarator"),
      Sequence(NT("noptr-declarator"), NT("parameters-and-qualifiers"), NT("trailing-return-type"))
    )
  )
);

rules.set("ptr-declarator", () =>
  Diagram(
    Choice(0,
      NT("noptr-declarator"),
      Sequence(NT("ptr-operator"), NT("ptr-declarator"))
    )
  )
);

rules.set("noptr-declarator", () =>
  Diagram(
    Sequence(
      Choice(0,
        Sequence(NT("declarator-id"), Optional(NT("attribute-specifier-seq"))),
        Sequence(T("("), NT("ptr-declarator"), T(")"))
      ),
      ZeroOrMore(
        Choice(0,
          NT("parameters-and-qualifiers"),
          Sequence(T("["), Optional(NT("constant-expression")), T("]"), Optional(NT("attribute-specifier-seq")))
        )
      )
    )
  )
);

rules.set("parameters-and-qualifiers", () =>
  Diagram(
    Sequence(
      T("("),
      NT("parameter-declaration-clause"),
      T(")"),
      Optional(NT("cv-qualifier-seq")),
      Optional(NT("ref-qualifier")),
      Optional(NT("noexcept-specifier")),
      Optional(NT("attribute-specifier-seq"))
    )
  )
);

rules.set("trailing-return-type", () =>
  Diagram(Sequence(T("->"), NT("type-id")))
);

rules.set("ptr-operator", () =>
  Diagram(
    Choice(0,
      Sequence(T("*"), Optional(NT("attribute-specifier-seq")), Optional(NT("cv-qualifier-seq"))),
      Sequence(T("&"), Optional(NT("attribute-specifier-seq"))),
      Sequence(T("&&"), Optional(NT("attribute-specifier-seq"))),
      Sequence(NT("nested-name-specifier"), T("*"), Optional(NT("attribute-specifier-seq")), Optional(NT("cv-qualifier-seq")))
    )
  )
);

rules.set("cv-qualifier-seq", () =>
  Diagram(OneOrMore(NT("cv-qualifier")))
);

rules.set("cv-qualifier", () =>
  Diagram(Choice(0, K("const"), K("volatile")))
);

rules.set("ref-qualifier", () =>
  Diagram(Choice(0, T("&"), T("&&")))
);

rules.set("declarator-id", () =>
  Diagram(Sequence(Optional(T("...")), NT("id-expression")))
);

rules.set("type-id", () =>
  Diagram(
    Sequence(NT("type-specifier-seq"), Optional(NT("abstract-declarator")))
  )
);

rules.set("defining-type-id", () =>
  Diagram(
    Sequence(NT("defining-type-specifier-seq"), Optional(NT("abstract-declarator")))
  )
);

rules.set("abstract-declarator", () =>
  Diagram(
    Choice(0,
      NT("ptr-abstract-declarator"),
      Sequence(Optional(NT("noptr-abstract-declarator")), NT("parameters-and-qualifiers"), NT("trailing-return-type")),
      NT("abstract-pack-declarator")
    )
  )
);

rules.set("ptr-abstract-declarator", () =>
  Diagram(
    Choice(0,
      NT("noptr-abstract-declarator"),
      Sequence(NT("ptr-operator"), Optional(NT("ptr-abstract-declarator")))
    )
  )
);

rules.set("noptr-abstract-declarator", () =>
  Diagram(
    Sequence(
      Optional(Sequence(T("("), NT("ptr-abstract-declarator"), T(")"))),
      ZeroOrMore(
        Choice(0,
          NT("parameters-and-qualifiers"),
          Sequence(T("["), Optional(NT("constant-expression")), T("]"), Optional(NT("attribute-specifier-seq")))
        )
      )
    )
  )
);

rules.set("abstract-pack-declarator", () =>
  Diagram(
    Choice(0,
      NT("noptr-abstract-pack-declarator"),
      Sequence(NT("ptr-operator"), NT("abstract-pack-declarator"))
    )
  )
);

rules.set("noptr-abstract-pack-declarator", () =>
  Diagram(
    Sequence(
      T("..."),
      ZeroOrMore(
        Choice(0,
          NT("parameters-and-qualifiers"),
          Sequence(T("["), Optional(NT("constant-expression")), T("]"), Optional(NT("attribute-specifier-seq")))
        )
      )
    )
  )
);

rules.set("parameter-declaration-clause", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("parameter-declaration-list")), Optional(T("..."))),
      Sequence(NT("parameter-declaration-list"), T(","), T("..."))
    )
  )
);

rules.set("parameter-declaration-list", () =>
  Diagram(
    Sequence(NT("parameter-declaration"), ZeroOrMore(Sequence(T(","), NT("parameter-declaration"))))
  )
);

rules.set("parameter-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("attribute-specifier-seq")), Optional(K("this")), NT("decl-specifier-seq"), NT("declarator")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("decl-specifier-seq"), NT("declarator"), T("="), NT("initializer-clause")),
      Sequence(Optional(NT("attribute-specifier-seq")), Optional(K("this")), NT("decl-specifier-seq"), Optional(NT("abstract-declarator"))),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("decl-specifier-seq"), Optional(NT("abstract-declarator")), T("="), NT("initializer-clause"))
    )
  )
);

rules.set("initializer", () =>
  Diagram(
    Choice(0,
      NT("brace-or-equal-initializer"),
      Sequence(T("("), NT("expression-list"), T(")"))
    )
  )
);

rules.set("brace-or-equal-initializer", () =>
  Diagram(
    Choice(0,
      Sequence(T("="), NT("initializer-clause")),
      NT("braced-init-list")
    )
  )
);

rules.set("initializer-clause", () =>
  Diagram(
    Choice(0,
      NT("assignment-expression"),
      NT("braced-init-list")
    )
  )
);

rules.set("braced-init-list", () =>
  Diagram(
    Choice(0,
      Sequence(T("{"), NT("initializer-list"), Optional(T(",")), T("}")),
      Sequence(T("{"), NT("designated-initializer-list"), Optional(T(",")), T("}")),
      Sequence(T("{"), T("}"))
    )
  )
);

rules.set("initializer-list", () =>
  Diagram(
    Sequence(
      NT("initializer-clause"),
      Optional(T("...")),
      ZeroOrMore(Sequence(T(","), NT("initializer-clause"), Optional(T("..."))))
    )
  )
);

rules.set("designated-initializer-list", () =>
  Diagram(
    Sequence(
      NT("designated-initializer-clause"),
      ZeroOrMore(Sequence(T(","), NT("designated-initializer-clause")))
    )
  )
);

rules.set("designated-initializer-clause", () =>
  Diagram(
    Sequence(NT("designator"), NT("brace-or-equal-initializer"))
  )
);

rules.set("designator", () =>
  Diagram(Sequence(T("."), NT("identifier")))
);

rules.set("expr-or-braced-init-list", () =>
  Diagram(
    Choice(0, NT("expression"), NT("braced-init-list"))
  )
);

rules.set("function-definition", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("attribute-specifier-seq")), Optional(NT("decl-specifier-seq")), NT("declarator"), Optional(NT("virt-specifier-seq")), NT("function-body")),
      Sequence(Optional(NT("attribute-specifier-seq")), Optional(NT("decl-specifier-seq")), NT("declarator"), NT("requires-clause"), NT("function-body"))
    )
  )
);

rules.set("function-body", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("ctor-initializer")), NT("compound-statement")),
      NT("function-try-block"),
      Sequence(T("="), K("default"), T(";")),
      Sequence(T("="), K("delete"), T(";"))
    )
  )
);

rules.set("enum-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(NT("enum-head"), T("{"), Optional(NT("enumerator-list")), T("}")),
      Sequence(NT("enum-head"), T("{"), NT("enumerator-list"), T(","), T("}"))
    )
  )
);

rules.set("enum-head", () =>
  Diagram(
    Sequence(
      NT("enum-key"),
      Optional(NT("attribute-specifier-seq")),
      Optional(NT("enum-head-name")),
      Optional(NT("enum-base"))
    )
  )
);

rules.set("enum-head-name", () =>
  Diagram(
    Sequence(Optional(NT("nested-name-specifier")), NT("identifier"))
  )
);

rules.set("opaque-enum-declaration", () =>
  Diagram(
    Sequence(NT("enum-key"), Optional(NT("attribute-specifier-seq")), NT("enum-head-name"), Optional(NT("enum-base")), T(";"))
  )
);

rules.set("enum-key", () =>
  Diagram(
    Choice(0,
      K("enum"),
      Sequence(K("enum"), K("class")),
      Sequence(K("enum"), K("struct"))
    )
  )
);

rules.set("enum-base", () =>
  Diagram(Sequence(T(":"), NT("type-specifier-seq")))
);

rules.set("enumerator-list", () =>
  Diagram(
    Sequence(NT("enumerator-definition"), ZeroOrMore(Sequence(T(","), NT("enumerator-definition"))))
  )
);

rules.set("enumerator-definition", () =>
  Diagram(
    Choice(0,
      NT("enumerator"),
      Sequence(NT("enumerator"), T("="), NT("constant-expression"))
    )
  )
);

rules.set("enumerator", () =>
  Diagram(Sequence(NT("identifier"), Optional(NT("attribute-specifier-seq"))))
);

rules.set("using-enum-declaration", () =>
  Diagram(
    Sequence(K("using"), K("enum"), NT("using-enum-declarator"), T(";"))
  )
);

rules.set("using-enum-declarator", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("nested-name-specifier")), NT("identifier")),
      Sequence(Optional(NT("nested-name-specifier")), NT("simple-template-id"))
    )
  )
);

rules.set("namespace-definition", () =>
  Diagram(
    Choice(0,
      NT("named-namespace-definition"),
      NT("unnamed-namespace-definition"),
      NT("nested-namespace-definition")
    )
  )
);

rules.set("named-namespace-definition", () =>
  Diagram(
    Sequence(Optional(K("inline")), K("namespace"), Optional(NT("attribute-specifier-seq")), NT("identifier"), T("{"), NT("namespace-body"), T("}"))
  )
);

rules.set("unnamed-namespace-definition", () =>
  Diagram(
    Sequence(Optional(K("inline")), K("namespace"), Optional(NT("attribute-specifier-seq")), T("{"), NT("namespace-body"), T("}"))
  )
);

rules.set("nested-namespace-definition", () =>
  Diagram(
    Sequence(K("namespace"), NT("enclosing-namespace-specifier"), T("::"), Optional(K("inline")), NT("identifier"), T("{"), NT("namespace-body"), T("}"))
  )
);

rules.set("enclosing-namespace-specifier", () =>
  Diagram(
    Sequence(
      NT("identifier"),
      ZeroOrMore(Sequence(T("::"), Optional(K("inline")), NT("identifier")))
    )
  )
);

rules.set("namespace-body", () =>
  Diagram(Optional(NT("declaration-seq")))
);

rules.set("namespace-alias-definition", () =>
  Diagram(
    Sequence(K("namespace"), NT("identifier"), T("="), NT("qualified-namespace-specifier"), T(";"))
  )
);

rules.set("qualified-namespace-specifier", () =>
  Diagram(
    Sequence(Optional(NT("nested-name-specifier")), NT("namespace-name"))
  )
);

rules.set("using-directive", () =>
  Diagram(
    Sequence(Optional(NT("attribute-specifier-seq")), K("using"), K("namespace"), Optional(NT("nested-name-specifier")), NT("namespace-name"), T(";"))
  )
);

rules.set("using-declaration", () =>
  Diagram(
    Sequence(K("using"), NT("using-declarator-list"), T(";"))
  )
);

rules.set("using-declarator-list", () =>
  Diagram(
    Sequence(
      NT("using-declarator"),
      Optional(T("...")),
      ZeroOrMore(Sequence(T(","), NT("using-declarator"), Optional(T("..."))))
    )
  )
);

rules.set("using-declarator", () =>
  Diagram(
    Sequence(Optional(K("typename")), NT("nested-name-specifier"), NT("unqualified-id"))
  )
);

rules.set("asm-declaration", () =>
  Diagram(
    Sequence(Optional(NT("attribute-specifier-seq")), K("asm"), T("("), NT("string-literal"), T(")"), T(";"))
  )
);

rules.set("linkage-specification", () =>
  Diagram(
    Choice(0,
      Sequence(K("extern"), NT("string-literal"), T("{"), Optional(NT("declaration-seq")), T("}")),
      Sequence(K("extern"), NT("string-literal"), NT("name-declaration"))
    )
  )
);

rules.set("attribute-specifier-seq", () =>
  Diagram(OneOrMore(NT("attribute-specifier")))
);

rules.set("attribute-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(T("[["), Optional(NT("attribute-using-prefix")), NT("attribute-list"), T("]]")),
      NT("alignment-specifier")
    )
  )
);

rules.set("alignment-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(K("alignas"), T("("), NT("type-id"), Optional(T("...")), T(")")),
      Sequence(K("alignas"), T("("), NT("constant-expression"), Optional(T("...")), T(")"))
    )
  )
);

rules.set("attribute-using-prefix", () =>
  Diagram(
    Sequence(K("using"), NT("attribute-namespace"), T(":"))
  )
);

rules.set("attribute-list", () =>
  Diagram(
    Sequence(
      Optional(NT("attribute")),
      ZeroOrMore(Sequence(T(","), Optional(NT("attribute")))),
      ZeroOrMore(Sequence(NT("attribute"), T("...")))
    )
  )
);

rules.set("attribute", () =>
  Diagram(
    Sequence(NT("attribute-token"), Optional(NT("attribute-argument-clause")))
  )
);

rules.set("attribute-token", () =>
  Diagram(
    Choice(0,
      NT("identifier"),
      NT("attribute-scoped-token")
    )
  )
);

rules.set("attribute-scoped-token", () =>
  Diagram(
    Sequence(NT("attribute-namespace"), T("::"), NT("identifier"))
  )
);

rules.set("attribute-namespace", () =>
  Diagram(NT("identifier"))
);

rules.set("attribute-argument-clause", () =>
  Diagram(
    Sequence(T("("), Optional(NT("balanced-token-seq")), T(")"))
  )
);

rules.set("balanced-token-seq", () =>
  Diagram(OneOrMore(NT("balanced-token")))
);

rules.set("balanced-token", () =>
  Diagram(
    Choice(0,
      Sequence(T("("), Optional(NT("balanced-token-seq")), T(")")),
      Sequence(T("["), Optional(NT("balanced-token-seq")), T("]")),
      Sequence(T("{"), Optional(NT("balanced-token-seq")), T("}")),
      Comment("any token except ( ) [ ] { }")
    )
  )
);

// ===== A.8 Modules [gram.module] =====

rules.set("module-declaration", () =>
  Diagram(
    Sequence(
      Optional(NT("export-keyword")),
      NT("module-keyword"),
      NT("module-name"),
      Optional(NT("module-partition")),
      Optional(NT("attribute-specifier-seq")),
      T(";")
    )
  )
);

rules.set("module-name", () =>
  Diagram(
    Sequence(Optional(NT("module-name-qualifier")), NT("identifier"))
  )
);

rules.set("module-partition", () =>
  Diagram(
    Sequence(T(":"), Optional(NT("module-name-qualifier")), NT("identifier"))
  )
);

rules.set("module-name-qualifier", () =>
  Diagram(
    OneOrMore(Sequence(NT("identifier"), T(".")))
  )
);

rules.set("export-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(K("export"), NT("name-declaration")),
      Sequence(K("export"), T("{"), Optional(NT("declaration-seq")), T("}")),
      Sequence(NT("export-keyword"), NT("module-import-declaration"))
    )
  )
);

rules.set("module-import-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(NT("import-keyword"), NT("module-name"), Optional(NT("attribute-specifier-seq")), T(";")),
      Sequence(NT("import-keyword"), NT("module-partition"), Optional(NT("attribute-specifier-seq")), T(";")),
      Sequence(NT("import-keyword"), NT("header-name"), Optional(NT("attribute-specifier-seq")), T(";"))
    )
  )
);

rules.set("global-module-fragment", () =>
  Diagram(
    Sequence(NT("module-keyword"), T(";"), Optional(NT("declaration-seq")))
  )
);

rules.set("private-module-fragment", () =>
  Diagram(
    Sequence(NT("module-keyword"), T(":"), K("private"), T(";"), Optional(NT("declaration-seq")))
  )
);

rules.set("import-keyword", () =>
  Diagram(K("import"))
);

rules.set("module-keyword", () =>
  Diagram(K("module"))
);

rules.set("export-keyword", () =>
  Diagram(K("export"))
);

// ===== A.9 Classes [gram.class] =====

rules.set("class-specifier", () =>
  Diagram(
    Sequence(NT("class-head"), T("{"), Optional(NT("member-specification")), T("}"))
  )
);

rules.set("class-head", () =>
  Diagram(
    Choice(0,
      Sequence(NT("class-key"), Optional(NT("attribute-specifier-seq")), NT("class-head-name"), Optional(NT("class-virt-specifier")), Optional(NT("base-clause"))),
      Sequence(NT("class-key"), Optional(NT("attribute-specifier-seq")), Optional(NT("base-clause")))
    )
  )
);

rules.set("class-head-name", () =>
  Diagram(
    Sequence(Optional(NT("nested-name-specifier")), NT("class-name"))
  )
);

rules.set("class-virt-specifier", () =>
  Diagram(K("final"))
);

rules.set("class-key", () =>
  Diagram(Choice(0, K("class"), K("struct"), K("union")))
);

rules.set("member-specification", () =>
  Diagram(
    OneOrMore(
      Choice(0,
        NT("member-declaration"),
        Sequence(NT("access-specifier"), T(":"))
      )
    )
  )
);

rules.set("member-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("attribute-specifier-seq")), Optional(NT("decl-specifier-seq")), Optional(NT("member-declarator-list")), T(";")),
      NT("function-definition"),
      NT("using-declaration"),
      NT("using-enum-declaration"),
      NT("static_assert-declaration"),
      NT("template-declaration"),
      NT("explicit-specialization"),
      NT("deduction-guide"),
      NT("alias-declaration"),
      NT("opaque-enum-declaration"),
      NT("empty-declaration")
    )
  )
);

rules.set("member-declarator-list", () =>
  Diagram(
    Sequence(NT("member-declarator"), ZeroOrMore(Sequence(T(","), NT("member-declarator"))))
  )
);

rules.set("member-declarator", () =>
  Diagram(
    Choice(0,
      Sequence(NT("declarator"), Optional(NT("virt-specifier-seq")), Optional(NT("pure-specifier"))),
      Sequence(NT("declarator"), NT("requires-clause")),
      Sequence(NT("declarator"), Optional(NT("brace-or-equal-initializer"))),
      Sequence(Optional(NT("identifier")), Optional(NT("attribute-specifier-seq")), T(":"), NT("constant-expression"), Optional(NT("brace-or-equal-initializer")))
    )
  )
);

rules.set("virt-specifier-seq", () =>
  Diagram(OneOrMore(NT("virt-specifier")))
);

rules.set("virt-specifier", () =>
  Diagram(Choice(0, K("override"), K("final")))
);

rules.set("pure-specifier", () =>
  Diagram(Sequence(T("="), T("0")))
);

rules.set("conversion-function-id", () =>
  Diagram(
    Sequence(K("operator"), NT("conversion-type-id"))
  )
);

rules.set("conversion-type-id", () =>
  Diagram(
    Sequence(NT("type-specifier-seq"), Optional(NT("conversion-declarator")))
  )
);

rules.set("conversion-declarator", () =>
  Diagram(
    Sequence(NT("ptr-operator"), Optional(NT("conversion-declarator")))
  )
);

rules.set("base-clause", () =>
  Diagram(Sequence(T(":"), NT("base-specifier-list")))
);

rules.set("base-specifier-list", () =>
  Diagram(
    Sequence(
      NT("base-specifier"),
      Optional(T("...")),
      ZeroOrMore(Sequence(T(","), NT("base-specifier"), Optional(T("..."))))
    )
  )
);

rules.set("base-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("attribute-specifier-seq")), NT("class-or-decltype")),
      Sequence(Optional(NT("attribute-specifier-seq")), K("virtual"), Optional(NT("access-specifier")), NT("class-or-decltype")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("access-specifier"), Optional(K("virtual")), NT("class-or-decltype"))
    )
  )
);

rules.set("class-or-decltype", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("nested-name-specifier")), NT("type-name")),
      Sequence(NT("nested-name-specifier"), K("template"), NT("simple-template-id")),
      NT("decltype-specifier")
    )
  )
);

rules.set("access-specifier", () =>
  Diagram(Choice(0, K("private"), K("protected"), K("public")))
);

rules.set("ctor-initializer", () =>
  Diagram(Sequence(T(":"), NT("mem-initializer-list")))
);

rules.set("mem-initializer-list", () =>
  Diagram(
    Sequence(
      NT("mem-initializer"),
      Optional(T("...")),
      ZeroOrMore(Sequence(T(","), NT("mem-initializer"), Optional(T("..."))))
    )
  )
);

rules.set("mem-initializer", () =>
  Diagram(
    Choice(0,
      Sequence(NT("mem-initializer-id"), T("("), Optional(NT("expression-list")), T(")")),
      Sequence(NT("mem-initializer-id"), NT("braced-init-list"))
    )
  )
);

rules.set("mem-initializer-id", () =>
  Diagram(
    Choice(0,
      NT("class-or-decltype"),
      NT("identifier")
    )
  )
);

// ===== A.10 Overloading [gram.over] =====

rules.set("operator-function-id", () =>
  Diagram(
    Sequence(K("operator"), NT("operator"))
  )
);

rules.set("operator", () =>
  Diagram(
    Choice(0,
      K("new"), K("delete"), T("new[]"), T("delete[]"), K("co_await"),
      T("()"), T("[]"), T("->"), T("->*"),
      T("~"), T("!"), T("+"), T("-"), T("*"), T("/"), T("%"), T("^"), T("&"),
      T("|"), T("="), T("+="), T("-="), T("*="), T("/="), T("%="), T("^="), T("&="),
      T("|="), T("=="), T("!="), T("<"), T(">"), T("<="), T(">="), T("<=>"), T("&&"),
      T("||"), T("<<"), T(">>"), T("<<="), T(">>="), T("++"), T("--"), T(",")
    )
  )
);

rules.set("literal-operator-id", () =>
  Diagram(
    Choice(0,
      Sequence(K("operator"), NT("string-literal"), NT("identifier")),
      Sequence(K("operator"), NT("user-defined-string-literal"))
    )
  )
);

// ===== A.11 Templates [gram.temp] =====

rules.set("template-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(NT("template-head"), NT("declaration")),
      Sequence(NT("template-head"), NT("concept-definition"))
    )
  )
);

rules.set("template-head", () =>
  Diagram(
    Sequence(K("template"), T("<"), NT("template-parameter-list"), T(">"), Optional(NT("requires-clause")))
  )
);

rules.set("template-parameter-list", () =>
  Diagram(
    Sequence(NT("template-parameter"), ZeroOrMore(Sequence(T(","), NT("template-parameter"))))
  )
);

rules.set("requires-clause", () =>
  Diagram(
    Sequence(K("requires"), NT("constraint-logical-or-expression"))
  )
);

rules.set("constraint-logical-or-expression", () =>
  Diagram(
    Sequence(
      NT("constraint-logical-and-expression"),
      ZeroOrMore(Sequence(T("||"), NT("constraint-logical-and-expression")))
    )
  )
);

rules.set("constraint-logical-and-expression", () =>
  Diagram(
    Sequence(
      NT("primary-expression"),
      ZeroOrMore(Sequence(T("&&"), NT("primary-expression")))
    )
  )
);

rules.set("template-parameter", () =>
  Diagram(
    Choice(0,
      NT("type-parameter"),
      NT("parameter-declaration")
    )
  )
);

rules.set("type-parameter", () =>
  Diagram(
    Choice(0,
      Sequence(NT("type-parameter-key"), Optional(T("...")), Optional(NT("identifier"))),
      Sequence(NT("type-parameter-key"), Optional(NT("identifier")), T("="), NT("type-id")),
      Sequence(NT("type-constraint"), Optional(T("...")), Optional(NT("identifier"))),
      Sequence(NT("type-constraint"), Optional(NT("identifier")), T("="), NT("type-id")),
      Sequence(NT("template-head"), NT("type-parameter-key"), Optional(T("...")), Optional(NT("identifier"))),
      Sequence(NT("template-head"), NT("type-parameter-key"), Optional(NT("identifier")), T("="), NT("id-expression"))
    )
  )
);

rules.set("type-parameter-key", () =>
  Diagram(Choice(0, K("class"), K("typename")))
);

rules.set("type-constraint", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("nested-name-specifier")), NT("concept-name")),
      Sequence(Optional(NT("nested-name-specifier")), NT("concept-name"), T("<"), Optional(NT("template-argument-list")), T(">"))
    )
  )
);

rules.set("simple-template-id", () =>
  Diagram(
    Sequence(NT("template-name"), T("<"), Optional(NT("template-argument-list")), T(">"))
  )
);

rules.set("template-id", () =>
  Diagram(
    Choice(0,
      NT("simple-template-id"),
      Sequence(NT("operator-function-id"), T("<"), Optional(NT("template-argument-list")), T(">")),
      Sequence(NT("literal-operator-id"), T("<"), Optional(NT("template-argument-list")), T(">"))
    )
  )
);

rules.set("template-argument-list", () =>
  Diagram(
    Sequence(
      NT("template-argument"),
      Optional(T("...")),
      ZeroOrMore(Sequence(T(","), NT("template-argument"), Optional(T("..."))))
    )
  )
);

rules.set("template-argument", () =>
  Diagram(
    Choice(0,
      NT("constant-expression"),
      NT("type-id"),
      NT("id-expression")
    )
  )
);

rules.set("constraint-expression", () =>
  Diagram(NT("logical-or-expression"))
);

rules.set("deduction-guide", () =>
  Diagram(
    Sequence(
      Optional(NT("explicit-specifier")),
      NT("template-name"),
      T("("),
      NT("parameter-declaration-clause"),
      T(")"),
      T("->"),
      NT("simple-template-id"),
      T(";")
    )
  )
);

rules.set("concept-definition", () =>
  Diagram(
    Sequence(K("concept"), NT("concept-name"), Optional(NT("attribute-specifier-seq")), T("="), NT("constraint-expression"), T(";"))
  )
);

rules.set("concept-name", () =>
  Diagram(NT("identifier"))
);

rules.set("typename-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(K("typename"), NT("nested-name-specifier"), NT("identifier")),
      Sequence(K("typename"), NT("nested-name-specifier"), Optional(K("template")), NT("simple-template-id"))
    )
  )
);

rules.set("explicit-instantiation", () =>
  Diagram(
    Sequence(Optional(K("extern")), K("template"), NT("declaration"))
  )
);

rules.set("explicit-specialization", () =>
  Diagram(
    Sequence(K("template"), T("<"), T(">"), NT("declaration"))
  )
);

// ===== A.12 Exception handling [gram.except] =====

rules.set("try-block", () =>
  Diagram(
    Sequence(K("try"), NT("compound-statement"), NT("handler-seq"))
  )
);

rules.set("function-try-block", () =>
  Diagram(
    Sequence(K("try"), Optional(NT("ctor-initializer")), NT("compound-statement"), NT("handler-seq"))
  )
);

rules.set("handler-seq", () =>
  Diagram(OneOrMore(NT("handler")))
);

rules.set("handler", () =>
  Diagram(
    Sequence(K("catch"), T("("), NT("exception-declaration"), T(")"), NT("compound-statement"))
  )
);

rules.set("exception-declaration", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(NT("attribute-specifier-seq")), NT("type-specifier-seq"), NT("declarator")),
      Sequence(Optional(NT("attribute-specifier-seq")), NT("type-specifier-seq"), Optional(NT("abstract-declarator"))),
      T("...")
    )
  )
);

rules.set("noexcept-specifier", () =>
  Diagram(
    Choice(0,
      Sequence(K("noexcept"), T("("), NT("constant-expression"), T(")")),
      K("noexcept")
    )
  )
);

// ===== A.13 Preprocessing directives [gram.cpp] =====

rules.set("preprocessing-file", () =>
  Diagram(
    Choice(0,
      Optional(NT("group")),
      NT("module-file")
    )
  )
);

rules.set("module-file", () =>
  Diagram(
    Sequence(
      Optional(NT("pp-global-module-fragment")),
      NT("pp-module"),
      Optional(NT("group")),
      Optional(NT("pp-private-module-fragment"))
    )
  )
);

rules.set("pp-global-module-fragment", () =>
  Diagram(
    Sequence(K("module"), T(";"), NT("new-line"), Optional(NT("group")))
  )
);

rules.set("pp-private-module-fragment", () =>
  Diagram(
    Sequence(K("module"), T(":"), K("private"), T(";"), NT("new-line"), Optional(NT("group")))
  )
);

rules.set("group", () =>
  Diagram(OneOrMore(NT("group-part")))
);

rules.set("group-part", () =>
  Diagram(
    Choice(0,
      NT("control-line"),
      NT("if-section"),
      NT("text-line"),
      Sequence(T("#"), NT("conditionally-supported-directive"))
    )
  )
);

rules.set("control-line", () =>
  Diagram(
    Choice(0,
      Sequence(T("#"), K("include"), NT("pp-tokens"), NT("new-line")),
      NT("pp-import"),
      Sequence(T("#"), K("define"), NT("identifier"), NT("replacement-list"), NT("new-line")),
      Sequence(T("#"), K("define"), NT("identifier"), NT("lparen"), Optional(NT("identifier-list")), T(")"), NT("replacement-list"), NT("new-line")),
      Sequence(T("#"), K("define"), NT("identifier"), NT("lparen"), T("..."), T(")"), NT("replacement-list"), NT("new-line")),
      Sequence(T("#"), K("define"), NT("identifier"), NT("lparen"), NT("identifier-list"), T(","), T("..."), T(")"), NT("replacement-list"), NT("new-line")),
      Sequence(T("#"), K("undef"), NT("identifier"), NT("new-line")),
      Sequence(T("#"), K("line"), NT("pp-tokens"), NT("new-line")),
      Sequence(T("#"), K("error"), Optional(NT("pp-tokens")), NT("new-line")),
      Sequence(T("#"), K("warning"), Optional(NT("pp-tokens")), NT("new-line")),
      Sequence(T("#"), K("pragma"), Optional(NT("pp-tokens")), NT("new-line")),
      Sequence(T("#"), NT("new-line"))
    )
  )
);

rules.set("if-section", () =>
  Diagram(
    Sequence(NT("if-group"), Optional(NT("elif-groups")), Optional(NT("else-group")), NT("endif-line"))
  )
);

rules.set("if-group", () =>
  Diagram(
    Choice(0,
      Sequence(T("#"), K("if"), NT("constant-expression"), NT("new-line"), Optional(NT("group"))),
      Sequence(T("#"), K("ifdef"), NT("identifier"), NT("new-line"), Optional(NT("group"))),
      Sequence(T("#"), K("ifndef"), NT("identifier"), NT("new-line"), Optional(NT("group")))
    )
  )
);

rules.set("elif-groups", () =>
  Diagram(OneOrMore(NT("elif-group")))
);

rules.set("elif-group", () =>
  Diagram(
    Choice(0,
      Sequence(T("#"), K("elif"), NT("constant-expression"), NT("new-line"), Optional(NT("group"))),
      Sequence(T("#"), K("elifdef"), NT("identifier"), NT("new-line"), Optional(NT("group"))),
      Sequence(T("#"), K("elifndef"), NT("identifier"), NT("new-line"), Optional(NT("group")))
    )
  )
);

rules.set("else-group", () =>
  Diagram(
    Sequence(T("#"), K("else"), NT("new-line"), Optional(NT("group")))
  )
);

rules.set("endif-line", () =>
  Diagram(Sequence(T("#"), K("endif"), NT("new-line")))
);

rules.set("text-line", () =>
  Diagram(Sequence(Optional(NT("pp-tokens")), NT("new-line")))
);

rules.set("conditionally-supported-directive", () =>
  Diagram(Sequence(NT("pp-tokens"), NT("new-line")))
);

rules.set("lparen", () =>
  Diagram(Comment("( not preceded by whitespace"))
);

rules.set("identifier-list", () =>
  Diagram(
    Sequence(NT("identifier"), ZeroOrMore(Sequence(T(","), NT("identifier"))))
  )
);

rules.set("replacement-list", () =>
  Diagram(Optional(NT("pp-tokens")))
);

rules.set("pp-tokens", () =>
  Diagram(OneOrMore(NT("preprocessing-token")))
);

rules.set("new-line", () =>
  Diagram(Comment("new-line character"))
);

rules.set("defined-macro-expression", () =>
  Diagram(
    Choice(0,
      Sequence(K("defined"), NT("identifier")),
      Sequence(K("defined"), T("("), NT("identifier"), T(")"))
    )
  )
);

rules.set("h-preprocessing-token", () =>
  Diagram(Comment("any preprocessing-token except >"))
);

rules.set("h-pp-tokens", () =>
  Diagram(OneOrMore(NT("h-preprocessing-token")))
);

rules.set("header-name-tokens", () =>
  Diagram(
    Choice(0,
      NT("string-literal"),
      Sequence(T("<"), NT("h-pp-tokens"), T(">"))
    )
  )
);

rules.set("has-include-expression", () =>
  Diagram(
    Choice(0,
      Sequence(T("__has_include"), T("("), NT("header-name"), T(")")),
      Sequence(T("__has_include"), T("("), NT("header-name-tokens"), T(")"))
    )
  )
);

rules.set("has-attribute-expression", () =>
  Diagram(
    Sequence(T("__has_cpp_attribute"), T("("), NT("pp-tokens"), T(")"))
  )
);

rules.set("pp-module", () =>
  Diagram(
    Sequence(Optional(K("export")), K("module"), Optional(NT("pp-tokens")), T(";"), NT("new-line"))
  )
);

rules.set("pp-import", () =>
  Diagram(
    Choice(0,
      Sequence(Optional(K("export")), K("import"), NT("header-name"), Optional(NT("pp-tokens")), T(";"), NT("new-line")),
      Sequence(Optional(K("export")), K("import"), NT("header-name-tokens"), Optional(NT("pp-tokens")), T(";"), NT("new-line")),
      Sequence(Optional(K("export")), K("import"), NT("pp-tokens"), T(";"), NT("new-line"))
    )
  )
);

rules.set("va-opt-replacement", () =>
  Diagram(
    Sequence(T("__VA_OPT__"), T("("), Optional(NT("pp-tokens")), T(")"))
  )
);

// --- React/TS integration exports --------------------------------------------

export type SectionId = "keywords" | "lexical" | "literals" | "basics" | "expressions" | "statements" | "declarations" | "modules" | "classes" | "overloading" | "templates" | "exceptions" | "preprocessing";
export type RuleName = string;

export const SECTION_ORDER: SectionId[] = [
  "keywords",
  "lexical",
  "literals",
  "basics",
  "expressions",
  "statements",
  "declarations",
  "modules",
  "classes",
  "overloading",
  "templates",
  "exceptions",
  "preprocessing"
];

export const SECTION_TITLES: Record<SectionId, string> = {
  keywords: "A.2 Keywords [gram.key]",
  lexical: "A.3 Lexical Conventions [gram.lex]",
  literals: "A.3 Literals",
  basics: "A.4 Basics [gram.basic]",
  expressions: "A.5 Expressions [gram.expr]",
  statements: "A.6 Statements [gram.stmt]",
  declarations: "A.7 Declarations [gram.dcl]",
  modules: "A.8 Modules [gram.module]",
  classes: "A.9 Classes [gram.class]",
  overloading: "A.10 Overloading [gram.over]",
  templates: "A.11 Templates [gram.temp]",
  exceptions: "A.12 Exception Handling [gram.except]",
  preprocessing: "A.13 Preprocessing [gram.cpp]"
};

export const SECTION_RULES: Record<SectionId, RuleName[]> = {
  "keywords": [
    "typedef-name",
    "namespace-name",
    "namespace-alias",
    "class-name",
    "enum-name",
    "template-name"
  ],
  "lexical": [
    "n-char",
    "n-char-sequence",
    "named-universal-character",
    "hex-quad",
    "simple-hexadecimal-digit-sequence",
    "universal-character-name",
    "preprocessing-token",
    "token",
    "header-name",
    "h-char-sequence",
    "h-char",
    "q-char-sequence",
    "q-char",
    "pp-number",
    "identifier",
    "identifier-start",
    "identifier-continue",
    "nondigit",
    "digit",
    "keyword",
    "preprocessing-op-or-punc",
    "preprocessing-operator",
    "operator-or-punctuator"
  ],
  "literals": [
    "literal",
    "integer-literal",
    "binary-literal",
    "octal-literal",
    "decimal-literal",
    "hexadecimal-literal",
    "binary-digit",
    "octal-digit",
    "nonzero-digit",
    "hexadecimal-prefix",
    "hexadecimal-digit-sequence",
    "hexadecimal-digit",
    "integer-suffix",
    "unsigned-suffix",
    "long-suffix",
    "long-long-suffix",
    "size-suffix",
    "character-literal",
    "encoding-prefix",
    "c-char-sequence",
    "c-char",
    "basic-c-char",
    "escape-sequence",
    "simple-escape-sequence",
    "simple-escape-sequence-char",
    "numeric-escape-sequence",
    "simple-octal-digit-sequence",
    "octal-escape-sequence",
    "hexadecimal-escape-sequence",
    "conditional-escape-sequence",
    "conditional-escape-sequence-char",
    "floating-point-literal",
    "decimal-floating-point-literal",
    "hexadecimal-floating-point-literal",
    "fractional-constant",
    "hexadecimal-fractional-constant",
    "exponent-part",
    "binary-exponent-part",
    "sign",
    "digit-sequence",
    "floating-point-suffix",
    "string-literal",
    "s-char-sequence",
    "s-char",
    "basic-s-char",
    "raw-string",
    "r-char-sequence",
    "r-char",
    "d-char-sequence",
    "d-char",
    "boolean-literal",
    "pointer-literal",
    "user-defined-literal",
    "user-defined-integer-literal",
    "user-defined-floating-point-literal",
    "user-defined-string-literal",
    "user-defined-character-literal",
    "ud-suffix"
  ],
  "basics": [
    "translation-unit"
  ],
  "expressions": [
    "primary-expression",
    "id-expression",
    "unqualified-id",
    "qualified-id",
    "nested-name-specifier",
    "lambda-expression",
    "lambda-introducer",
    "lambda-declarator",
    "lambda-specifier",
    "lambda-specifier-seq",
    "lambda-capture",
    "capture-default",
    "capture-list",
    "capture",
    "simple-capture",
    "init-capture",
    "fold-expression",
    "fold-operator",
    "requires-expression",
    "requirement-parameter-list",
    "requirement-body",
    "requirement-seq",
    "requirement",
    "simple-requirement",
    "type-requirement",
    "compound-requirement",
    "return-type-requirement",
    "nested-requirement",
    "postfix-expression",
    "expression-list",
    "unary-expression",
    "unary-operator",
    "await-expression",
    "noexcept-expression",
    "new-expression",
    "new-placement",
    "new-type-id",
    "new-declarator",
    "noptr-new-declarator",
    "new-initializer",
    "delete-expression",
    "cast-expression",
    "pm-expression",
    "multiplicative-expression",
    "additive-expression",
    "shift-expression",
    "compare-expression",
    "relational-expression",
    "equality-expression",
    "and-expression",
    "exclusive-or-expression",
    "inclusive-or-expression",
    "logical-and-expression",
    "logical-or-expression",
    "conditional-expression",
    "yield-expression",
    "throw-expression",
    "assignment-expression",
    "assignment-operator",
    "expression",
    "constant-expression"
  ],
  "statements": [
    "statement",
    "init-statement",
    "condition",
    "label",
    "labeled-statement",
    "expression-statement",
    "compound-statement",
    "statement-seq",
    "label-seq",
    "selection-statement",
    "iteration-statement",
    "for-range-declaration",
    "for-range-initializer",
    "jump-statement",
    "coroutine-return-statement",
    "declaration-statement"
  ],
  "declarations": [
    "declaration-seq",
    "declaration",
    "name-declaration",
    "special-declaration",
    "block-declaration",
    "nodeclspec-function-declaration",
    "alias-declaration",
    "simple-declaration",
    "static_assert-declaration",
    "empty-declaration",
    "attribute-declaration",
    "decl-specifier",
    "decl-specifier-seq",
    "storage-class-specifier",
    "function-specifier",
    "explicit-specifier",
    "type-specifier",
    "type-specifier-seq",
    "defining-type-specifier",
    "defining-type-specifier-seq",
    "simple-type-specifier",
    "type-name",
    "elaborated-type-specifier",
    "decltype-specifier",
    "placeholder-type-specifier",
    "init-declarator-list",
    "init-declarator",
    "declarator",
    "ptr-declarator",
    "noptr-declarator",
    "parameters-and-qualifiers",
    "trailing-return-type",
    "ptr-operator",
    "cv-qualifier-seq",
    "cv-qualifier",
    "ref-qualifier",
    "declarator-id",
    "type-id",
    "defining-type-id",
    "abstract-declarator",
    "ptr-abstract-declarator",
    "noptr-abstract-declarator",
    "abstract-pack-declarator",
    "noptr-abstract-pack-declarator",
    "parameter-declaration-clause",
    "parameter-declaration-list",
    "parameter-declaration",
    "initializer",
    "brace-or-equal-initializer",
    "initializer-clause",
    "braced-init-list",
    "initializer-list",
    "designated-initializer-list",
    "designated-initializer-clause",
    "designator",
    "expr-or-braced-init-list",
    "function-definition",
    "function-body",
    "enum-specifier",
    "enum-head",
    "enum-head-name",
    "opaque-enum-declaration",
    "enum-key",
    "enum-base",
    "enumerator-list",
    "enumerator-definition",
    "enumerator",
    "using-enum-declaration",
    "using-enum-declarator",
    "namespace-definition",
    "named-namespace-definition",
    "unnamed-namespace-definition",
    "nested-namespace-definition",
    "enclosing-namespace-specifier",
    "namespace-body",
    "namespace-alias-definition",
    "qualified-namespace-specifier",
    "using-directive",
    "using-declaration",
    "using-declarator-list",
    "using-declarator",
    "asm-declaration",
    "linkage-specification",
    "attribute-specifier-seq",
    "attribute-specifier",
    "alignment-specifier",
    "attribute-using-prefix",
    "attribute-list",
    "attribute",
    "attribute-token",
    "attribute-scoped-token",
    "attribute-namespace",
    "attribute-argument-clause",
    "balanced-token-seq",
    "balanced-token"
  ],
  "modules": [
    "module-declaration",
    "module-name",
    "module-partition",
    "module-name-qualifier",
    "export-declaration",
    "module-import-declaration",
    "global-module-fragment",
    "private-module-fragment",
    "import-keyword",
    "module-keyword",
    "export-keyword"
  ],
  "classes": [
    "class-specifier",
    "class-head",
    "class-head-name",
    "class-virt-specifier",
    "class-key",
    "member-specification",
    "member-declaration",
    "member-declarator-list",
    "member-declarator",
    "virt-specifier-seq",
    "virt-specifier",
    "pure-specifier",
    "conversion-function-id",
    "conversion-type-id",
    "conversion-declarator",
    "base-clause",
    "base-specifier-list",
    "base-specifier",
    "class-or-decltype",
    "access-specifier",
    "ctor-initializer",
    "mem-initializer-list",
    "mem-initializer",
    "mem-initializer-id"
  ],
  "overloading": [
    "operator-function-id",
    "operator",
    "literal-operator-id"
  ],
  "templates": [
    "template-declaration",
    "template-head",
    "template-parameter-list",
    "requires-clause",
    "constraint-logical-or-expression",
    "constraint-logical-and-expression",
    "template-parameter",
    "type-parameter",
    "type-parameter-key",
    "type-constraint",
    "simple-template-id",
    "template-id",
    "template-argument-list",
    "template-argument",
    "constraint-expression",
    "deduction-guide",
    "concept-definition",
    "concept-name",
    "typename-specifier",
    "explicit-instantiation",
    "explicit-specialization"
  ],
  "exceptions": [
    "try-block",
    "function-try-block",
    "handler-seq",
    "handler",
    "exception-declaration",
    "noexcept-specifier"
  ],
  "preprocessing": [
    "preprocessing-file",
    "module-file",
    "pp-global-module-fragment",
    "pp-private-module-fragment",
    "group",
    "group-part",
    "control-line",
    "if-section",
    "if-group",
    "elif-groups",
    "elif-group",
    "else-group",
    "endif-line",
    "text-line",
    "conditionally-supported-directive",
    "lparen",
    "identifier-list",
    "replacement-list",
    "pp-tokens",
    "new-line",
    "defined-macro-expression",
    "h-preprocessing-token",
    "h-pp-tokens",
    "header-name-tokens",
    "has-include-expression",
    "has-attribute-expression",
    "pp-module",
    "pp-import",
    "va-opt-replacement"
  ]
};

// Expose safe accessors for React UI.
export function getRuleFactory(name: RuleName): (() => any) | undefined {
  return rules.get(name);
}

export function createRuleDiagram(name: RuleName): any {
  const factory = rules.get(name);
  if (!factory) {
    return Diagram(Comment(`No factory defined for ${name}`));
  }
  return factory();
}
