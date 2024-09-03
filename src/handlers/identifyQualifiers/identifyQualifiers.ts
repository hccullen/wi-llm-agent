import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

import { classifySegmentPrompt } from "./prompts/classifySegment";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getQualifierExamples } from "../../utils/prompt_utils";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { sortParagraphs } from "../../utils/general_utils";

export const identifyQualifiers = async (
  document: Blob
): Promise<any> => {
  console.log(document);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 40,
    separators: ["\n"],
  });

  // Currently only supports PDFs
  const loader = new PDFLoader(document, {
    splitPages: false,
  });

  const docs = await loader.load();
  const splitDocument = await splitter.splitDocuments(docs);

  const classes: any[] = [];

  await Promise.all(
    splitDocument.map(async (segment) => {
      try {
        const segmentClassification = await classifySegment(
          segment.pageContent
        );

        segmentClassification.data.forEach((paragraph) => {
          if (Object.values(paragraph.qualifiers).includes(true) || true) {
            classes.push(paragraph);
          }
        });
        return true;
      } catch (error) {
        console.error(error);
        return;
      }
    })
  );

  const sortedParagraphs = sortParagraphs(classes);

  return sortedParagraphs;
};

const classifySegment = async (segment: string) => {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const promptSegmentClassification = PromptTemplate.fromTemplate(
    classifySegmentPrompt
  );

  const qualifierClassificationSchema = z.object({
    paragraphNumber: z.string().describe("The paragraph/section number"),
    paragraphText: z
      .string()
      .describe("The individual warranty 'paragraph'/section text"),
    qualifiers: z.object({
      knowledgeQualifier: z
        .boolean()
        .describe("Whether there is a knowledge qualifier in the text"),
      materialityQualifier: z
        .boolean()
        .describe("Whether there is a materiality qualifier in the text"),
      timeLimitationQualifier: z
        .boolean()
        .describe("Whether there is a time limitation qualifier in the text"),
    }),
  });

  const wrapperSchema = z.object({
    data: z.array(qualifierClassificationSchema),
  });

  const structuredModel = model.withStructuredOutput(wrapperSchema);

  const combinedChain = RunnableSequence.from([
    promptSegmentClassification,
    structuredModel,
  ]);
  const classes = await combinedChain.invoke({
    SEGMENT: segment,
    FEW_SHOT_EXAMPLES: getQualifierExamples(),
  });

  return classes;
};
