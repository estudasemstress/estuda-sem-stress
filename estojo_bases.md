# ESTOJO · BASES DE GERAÇÃO (resumos + PowerPoints)

Ficheiro-base para o site. Sempre que a utilizadora pedir um **resumo** ou um **PowerPoint** de uma matéria, o gerador segue ESTAS bases: a **estrutura e o estilo são fixos**; só mudam o **texto** (claro e simples), as **imagens** e as **cores de destaque** (se pedidas).

Ficheiros-modelo de referência (guardar junto deste ficheiro no site):
- `resumo.pdf` → modelo de RESUMO (Sistema Esquelético)
- `Estudo_de_Anatomia_completo.pptx` → modelo de POWERPOINT (44 diapositivos)

---

## 0 · REGRAS GERAIS (valem para os dois)

1. **Fonte do conteúdo:** usar SÓ o material enviado pela utilizadora (slides, PDFs, apontamentos). Não inventar factos; se faltar informação, dizê-lo.
2. **Texto claro:** frases curtas, vocabulário simples, termos técnicos mantidos mas explicados à primeira vez. Uma ideia por linha. Termos-chave a **negrito**.
3. **Não copiar** textos ou imagens de manuais protegidos por direitos de autor: reescrever por palavras próprias.
4. **Imagens diferentes em cada pedido:** usar imagens soltas retiradas dos ficheiros da utilizadora (nunca fotografias inteiras de slides) ou esquemas redesenhados/ilustrações. Cada imagem com legenda curta. Não repetir as imagens dos modelos.
5. **Nunca mudar a estrutura** dos modelos (ordem das secções, tipos de diapositivo, caixas, rodapés).
6. Língua: português de Portugal.

---

## 1 · BASE «RESUMO» (modelo: resumo.pdf)

**Aspeto:** A4 vertical, tudo **cinzento e branco**, letra **monoespaçada** (Courier / Courier New), sem cor.

| Elemento | Estilo |
|---|---|
| Fundo | Branco `#FFFFFF` |
| Texto | Preto `#000000`, ~9 pt |
| Caixas de listas | Fundo `#F2F2F2`, borda fina `#BBBBBB`, linhas a começar por «- » |
| Cabeçalho de tabela | Fundo `#D9D9D9`, texto a negrito centrado |
| Coluna de rótulos (tabelas chave-valor) | Fundo `#D9D9D9`, negrito |
| Linhas das tabelas | `#BBBBBB`, 0,5 pt |
| Títulos de secção | MAIÚSCULAS, negrito, numerados («1. ENQUADRAMENTO…»), linha fina por baixo |
| Subtítulos | «1 · SUPORTE» (número + ponto médio + nome em maiúsculas), negrito |
| Rodapé (todas as páginas) | Linha fina; à esquerda «NOME DO TEMA» (maiúsculas); à direita «PÁG. x/total» |

**Estrutura fixa (por esta ordem):**
1. **Capa na página 1:** título do tema (centrado, maiúsculas, negrito) · linha «GUIA DE ESTUDO · …» (subtítulo) · «Unidade Curricular: …» · caixa cinzenta com notas sobre a origem do texto e das imagens.
2. **1. Enquadramento e visão geral:** tabela chave-valor (instituição, docente, unidades curriculares).
3. **Visão geral do tema:** 1 parágrafo curto com números-chave a negrito + tabela de divisões.
4. **2. Funções / ideias principais:** um subtítulo numerado por função, cada um com a sua caixa cinzenta de bullets (3 a 5 linhas).
5. **Secções seguintes (3, 4, 5…):** conteúdo por tópicos usando SEMPRE um destes blocos:
   - **Tabela de 3 colunas** (Termo | Característica | Exemplo) para classificações;
   - **Tabela chave-valor** (rótulo cinzento à esquerda + descrição) para componentes e células;
   - **Tabela de etapas** (Nº | Etapa | Descrição) para processos;
   - **Tabela comparativa** (Característica | A | B);
   - **Caixa de bullets** para listas curtas.
6. **Complementos** (opcional): quadros de apoio (terminologia, comparações) assinalados como «COMPLEMENTO».
7. **Nota final** (opcional) em caixa cinzenta.

**Regras de página:** uma secção principal pode ocupar 1 a 2 páginas; não cortar tabelas a meio (passar para a página seguinte); imagens, se existirem, ficam centradas por baixo do bloco a que pertencem, com legenda.

**Saída:** PDF e/ou Word (.docx) com o mesmo aspeto.

---

## 2 · BASE «POWERPOINT» (modelo: Estudo_de_Anatomia_completo.pptx)

**Aspeto:** estilo «vintage de anatomia» — fundo creme, ilustrações antigas, títulos com serifa.
Formato 16:9 (1440 × 810 pt).

### Cores
| Uso | Hex |
|---|---|
| Fundo normal | `#F5ECD7` |
| Fundo de capa / divisória / fecho | `#4B4A2E` (verde-oliva) |
| Texto principal | `#33311F` |
| Texto secundário | `#6B6650` |
| Destaque (títulos pequenos, números, acentos) | `#9A5B3D` (terracota); claro `#C98A6B` |
| Cartões / caixas claras | `#EBDFC2` e `#F1E8D2` |
| Linhas finas | `#D9CFB4` / `#E4DAC0` |
| Texto sobre fundo escuro | `#FFFFFF` / creme `#F5ECD7` |

### Tipografia
- **Títulos:** Cormorant Garamond (serifa), 44 pt (capa/divisória até 150 pt para o número).
- **Corpo:** Source Sans 3, 16–20 pt; rótulos 12–14 pt.
- (Alternativas se a fonte não existir: Georgia / Calibri.)

### Posições fixas
- Margem esquerda **75 pt**; título a **43 pt** do topo.
- Número do diapositivo («02», «03»…) no canto inferior direito, ~(1339, 742) pt, pequeno, `#6B6650`.
- Imagem principal ocupa um lado (esquerdo ou direito); texto no outro. Imagens com ar de ilustração antiga (sépia/creme), cantos retos.

### Caixa «Atenção no teste» (assinatura do estilo)
Retângulo `#4B4A2E`, texto creme: **«Atenção no teste · …»** + 1 frase (o que costuma sair / pormenor que engana). Usar 1 por diapositivo de conteúdo, no fundo.

### Catálogo de diapositivos (usar só estes tipos)
| Tipo | Quando | Campos |
|---|---|---|
| `capa` | Diapositivo 1 | título, data · sala, lista de temas, autora, imagem |
| `indice` | Diapositivo 2 | título, 3–4 cartões numerados (círculo + nome + nº de perguntas + conteúdo), caixa «Atenção no teste» |
| `divisoria` | Início de cada parte | fundo oliva, número grande («01»), nome da parte, subtítulo |
| `texto_imagem` | Explicar um conceito | título, 2–4 blocos (rótulo + frase), imagem, caixa opcional |
| `colunas` | Comparar / listar dois conjuntos | título, 2 colunas (cabeçalho + 3–5 linhas) |
| `passos` | Processos | título, passos numerados 1–6 (nome + 1 frase) |
| `cartoes` | Tipos / classificações | título, 3–6 cartões (nome + exemplo) |
| `resumo` | Fecho de uma parte | título, 2–3 cartões «Resumo para…» |
| `verdadeiro_falso` | Treino | título, 6–12 afirmações com V/F e a palavra que a torna falsa |
| `identificar` | Anatomia em imagem | título, imagem com legendas numeradas, lista numerada (1–8) |
| `pergunta_aberta` | Resposta modelo | título, enunciado, resposta em 3–5 frases, «Palavras-chave» |
| `fecho` | Último diapositivo | fundo oliva, «Bom estudo.», «Tu consegues.», data · sala, imagem |

### Ordem do PowerPoint
`capa` → `indice` → [`divisoria` → diapositivos de conteúdo → `resumo`] × cada parte → treino (`verdadeiro_falso`) → `identificar` → `pergunta_aberta` × N → `fecho`.
Regra de tamanho: 1 ideia por diapositivo; no máximo ~60 palavras por diapositivo.

---

## 3 · FORMATO DE SAÍDA PARA O GERADOR (JSON)

O gerador devolve JSON; o site desenha-o com os modelos acima.

### Resumo
```json
{
  "tipo": "resumo",
  "titulo": "SISTEMA RESPIRATÓRIO",
  "subtitulo": "GUIA DE ESTUDO · …",
  "uc": "Anatomia e Fisiologia Humana",
  "nota_origem": "Texto escrito a partir dos slides da aula; imagens retiradas dos ficheiros da aluna.",
  "seccoes": [
    {"numero": 1, "titulo": "ENQUADRAMENTO E VISÃO GERAL",
     "blocos": [
       {"bloco": "tabela_chave_valor", "linhas": [["Instituição", "…"]]},
       {"bloco": "caixa_bullets", "subtitulo": "1 · SUPORTE", "linhas": ["…"]},
       {"bloco": "tabela", "colunas": ["Tipo","Características","Exemplos"], "linhas": [["…","…","…"]]},
       {"bloco": "tabela_etapas", "linhas": [[1,"Etapa","Descrição"]]},
       {"bloco": "imagem", "ficheiro": "…", "legenda": "…"}
     ]}
  ]
}
```

### PowerPoint
```json
{
  "tipo": "apresentacao",
  "titulo": "…",
  "data_sala": "28 de outubro · Sala EC 1.7",
  "slides": [
    {"layout": "divisoria", "numero": "01", "titulo": "…", "subtitulo": "…"},
    {"layout": "texto_imagem", "titulo": "…",
     "blocos": [{"rotulo": "…", "texto": "…"}],
     "imagem": {"ficheiro": "…", "legenda": "…"},
     "atencao": "…"},
    {"layout": "verdadeiro_falso", "titulo": "…",
     "itens": [{"afirmacao": "…", "valor": "V", "palavra_chave": "…"}]}
  ]
}
```

---

## 4 · INSTRUÇÃO PARA A IA DO SITE (colar como «system prompt»)

> És o gerador de materiais de estudo do Estojo. Quando a utilizadora pedir um RESUMO ou um POWERPOINT, segue exatamente as bases deste ficheiro: não alteres a estrutura, os tipos de diapositivo, as caixas nem o estilo. Usa apenas o material que ela enviou. Escreve em português de Portugal, com frases curtas e claras e termos-chave a negrito. Escolhe imagens diferentes das dos modelos: imagens soltas do material dela ou esquemas redesenhados, nunca fotografias inteiras de slides. Devolve o resultado no formato JSON da secção 3. Se o material for insuficiente para uma secção ou diapositivo, indica-o em vez de inventar.
