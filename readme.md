# W&I LLM Agent

Currently only exposes a single endpoint, `/extractQualifiers`, that takes a single PDF file.

```
curl --location 'http://localhost:3001/extractQualifiers' \
--form 'file=@"./Project_ Audia_Sellers_Warranties.pdf"'
```

## Quick Start
1. `npm install`
2. Create a `.env` file based on the example and set your OpenAI API credentials. Optionally also enable Langsmith.
3. Start Server with `npm run start`.
4. Server will start on http://localhost:3001, though port can be configured in .env file. Server runs through nodemon in development, enabling auto-reload on file changes.

## How it works
1. Upload a PDF
2. PDF split into up to 1000 character chunks
3. Each segment is then run through an LLM with few-shot examples to identify all of the following:
    - Knowledge qualifiers
    - Materiality qualifiers
    - Time-Limitation qualifiers
4. The LLM returns an array, as the segment may contain multiple discrete paragraphs.
5. These arrays are concatenated and returned.

## Why PDF not DOCX
While libraries such as `mammoth` can parse docx files, crucial information such as the header numbering is not typically stored as text. Instead, it is inferred as part of the header styles. Parsing this would not be feasible/realisitic. Converting to PDF first ensures those numbers are encoded as text, albeit at the cost of structure.

**TO DO:** Investigate converting from docx to PDF on the fly.

## Future State
Transition this to act as a Langchain Agent, using the indiviudual functionalities such as `/extractQualifiers` as tools.