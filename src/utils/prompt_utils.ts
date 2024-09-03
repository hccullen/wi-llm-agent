import { qualifierClasses } from "../data/qualifier_classes";


export const getQualifierExamples = () => {
    // filter the array of objects to include up to 25 examples of qualifiers and up to 10 examples where qualifer is null
    const qualifiers = qualifierClasses
      .filter((segment) => segment.qualifiers !== null)
      .slice(0, 25);
    const noQualifiers = qualifierClasses
      .filter((segment) => segment.qualifiers === null)
      .slice(0, 6);
  
    const allExamples = [...qualifiers, ...noQualifiers];
  
    //randomize the order of the array of objects
    const randomExamples = allExamples.sort(() => Math.random() - 0.5);
  
    return randomExamples
      .map((segment, index) => {
        return `  <EXAMPLE ${index + 1}>
       Segment: ${segment.text}
       Qualifiers: ${segment.qualifiers}
     </EXAMPLE ${index + 1}>`;
      })
      .join("\n\n");
  };