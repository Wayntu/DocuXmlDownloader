let UserDefinedTag = ''
const parseUserDefinedTag = (content) => {
    const tagName = {}
    const nodeList = content.firstChild.firstChild.childNodes
    for (let i = 0; i　< nodeList.length; i++) {
        let node = nodeList[i]
        if (node.nodeName.substr(0,4) == 'Udef') {    // nodename: Udef_XXX
            tagName[node.nodeName] = node.nodeName
        }
    }
    for (let key in tagName) {
        UserDefinedTag += "<tag default_sub_category='-' default_category='" + key + "' type='contentTagging'>" + key + "</tag>" 
    }
}
const convertContent = (docContentXml) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(docContentXml, "text/xml");
      parseUserDefinedTag(xmlDoc)
      const nodeList = xmlDoc.firstChild.childNodes
      let xmlString = ''
      for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeName === 'Paragraph')
                  xmlString += nodeList[i].outerHTML
      }
      return xmlString
}
const convertMetadata = (docMetadataXml) => {
      if (docMetadataXml === undefined) return ''
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(docMetadataXml, "text/xml")
      let xmlString = ''
      if (xmlDoc.firstChild.nodeName === "DocMetadata")
            xmlString = xmlDoc.firstChild.innerHTML
      return xmlString
}
const convertTitle = (docTitleXml) => {
      if (docTitleXml === undefined) return ''
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(docTitleXml, "text/xml")
      let xmlString = ''
      if (xmlDoc.firstChild.nodeName === 'DocTitle')
            xmlString = xmlDoc.firstChild.innerHTML
      return xmlString
}
const convertTimeInfo = ({
      dateOrigStr='',
      dateDynasty='',
      dateEra='',
      dateChNormYear='',
      dateAdDate='',
      dateAdYear='',
      timeseqType='',
      timeseqNumber='',
      }) => {
      return "<time_orig_str>" + dateOrigStr + "</time_orig_str>"
            + "<time_dynasty>" + dateDynasty + "</time_dynasty>"
            + "<time_era>" + dateEra + "</time_era>"
            + "<time_norm_year>" + dateChNormYear + "</time_norm_year>"
            + "<time_ad_date>" + dateAdDate + "</time_ad_date>"
            + "<time_ad_year>" + dateAdYear + "</time_ad_year>"
            + "<timeseq_type>" + timeseqType + "</timeseq_type>"
            + "<timeseq_number>" + timeseqNumber + "</timeseq_number>"
}
const convertPlaceInfo = ({
      geoLevel1='',
      geoLevel2='',
      geoLevel3='',
      geoX='',
      geoY='',
      }) => {
      return "<geo_level1>" + geoLevel1 + "</geo_level1>"
            + "<geo_level2>" + geoLevel2 + "</geo_level2>"
            + "<geo_level3>" + geoLevel3 + "</geo_level3>"
            + "<geo_longitude>" + geoX + "</geo_longitude>"
            + "<geo_latitude>" + geoY + "</geo_latitude>"
}
const parseDocument = ({
            // 必要資訊
            number,
            corpus,                 // corpus
            corpusOrder,            // corpus: corpus_order attribute
            docContentXml,          // doc_content
            docMetadataXml,         // xml_metadata
            docTitleXml,            // title
            docFilename,            // document: filename attribute
            timeInfo,               // dateOrigStr: time_orig_str, dateDynasty: time_dynasty, 
            placeInfo,              // geoLevel1: geo_level1 ... geoLevel3: geo_level3, geoX: geo_longitude, geoY: geo_latitude
            //------------------------------------------------------
            docCompilation='',         // compilation
            docSource='',              // doc_source
            docSourceOrder=0,        // doc_source: doc_source_order attribute
            docType='',                // doctype
            docXmlFormatSubname='',    // docclass
            author='',                 // author
            docUserTagging='',         // doc_user_tagging (DocuSky don't support this information currently)
            docTopicL1='',             // topic
            docTopicL1Order=0,
            //--------------------- other information--------------
            // 這邊的資訊 DocuXml Draft 並沒有提供相對應的轉換
            docId='',
            docTimeCreated='',
            xmlFormatName='',
            // extraMetadata='',    // DocuSky不支援?
      }) => {
            const parser = new DOMParser()
            let xmlString = "<document filename='" + docFilename + "' number='" + number + "'>"
                  + "<corpus corpus_order='" + corpusOrder + "'>" + corpus + "</corpus>"
                  + "<compilation>" + docCompilation + "</compilation>"
                  + "<doc_content>" + convertContent(docContentXml) + "</doc_content>"
                  + "<xml_metadata>" + convertMetadata(docMetadataXml) + "</xml_metadata>"
                  + "<title>" + convertTitle(docTitleXml) + "</title>"
                  + "<doc_source doc_source_order='" + docSourceOrder + "'>" + docSource + "</doc_source>"
                  + "<doctype>" + docType + "</doctype>"
                  + "<docclass>" + docXmlFormatSubname + "</docclass>"
                  + convertTimeInfo(timeInfo)
                  + convertPlaceInfo(placeInfo)
                  + "<author>" + author + "</author>"
                  + "<doc_user_tagging>" + UserDefinedTag + "</doc_user_tagging>"
                  + "<topic topic_order='" + docTopicL1Order + "'>" + docTopicL1 + "</topic>"
                  + "<doc_id>" + docId + "</doc_id>"
                  + "<doc_time_created>" + docTimeCreated + "</doc_time_created>"
                  + "<xml_format_name>" + xmlFormatName + "</xml_format_name>"
                  // + "<extra_metadata>" + extraMetadata + "</extra_metadata>"
                  + "</document>"
            const xmlDoc = parser.parseFromString(xmlString, "text/xml")
            return xmlString
}

const exportDocuXml = ({documents, db, corpus}) => {
    let documentXml = ''
    for (let number in documents) {
        let document = documents[number]
        documentXml += parseDocument({...document, number})
    }
    const xmlString = "<ThdlPrototypeExport>"
                    + "<db>" + db + "</db>"
                    + "<corpus name='" + corpus + "'>"
                    + "</corpus>"
                    + "<documents>"
                    + documentXml
                    + "</documents></ThdlPrototypeExport>"
    return xmlString
}