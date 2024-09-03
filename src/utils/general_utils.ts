export const sortParagraphs = (paragraphs: any[]) => {
    return paragraphs.sort((a, b) => {
        const aSplit = a.paragraphNumber.split(".");
        const bSplit = b.paragraphNumber.split(".");
        const aInt = parseInt(aSplit[0]);
        const bInt = parseInt(bSplit[0]);

        if (aInt === bInt) {
            const aDecimal = parseInt(aSplit[1]);
            const bDecimal = parseInt(bSplit[1]);

            if (aDecimal === bDecimal) {
                const aDec2 = parseInt(aSplit[2]);
                const bDec2 = parseInt(bSplit[2]);
                return aDec2 - bDec2
            }

            return aDecimal - bDecimal;
        }


        return aInt - bInt;
    });
};