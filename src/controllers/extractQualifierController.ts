import { Request, Response } from 'express';
import { identifyQualifiers } from '../handlers/identifyQualifiers';



const handleExtractQualifiers = async (req: Request & { file?: any }, res: Response) => {

  if (!req.file || req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: "Invalid file type" });
  }

  try {
    const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    const extractedQualifiers = await identifyQualifiers(fileBlob);
    return res.status(200).json(extractedQualifiers);
  } catch (error) {
    return res.status(500).json({ message: "Error processing file", error });
  }
};

export default handleExtractQualifiers;
