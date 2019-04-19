class DocuSkyExporter {
      constructor() {
            this.corpus = ''
            this.db = ''
            this.UserDefinedTag = ''
            this.featureAnalysis = {}

            this.parseUserDefinedTag = this.parseUserDefinedTag.bind(this)
      }
      generateDocuXml({documents, db, corpus}) {
            let documentXml = ''
            this.db = db
            this.corpus = corpus
            for (let number in documents) {
                  let document = documents[number]
                  //documentXml += this.parseDocument({...document, number})
                  let d = document; d.number = number;
                  documentXml += this.parseDocument(d);
            }
            const xmlString = "<ThdlPrototypeExport>"
                              + "<corpus name='*'>"
                              + this.generateFeatureAnalysisInfo()
                              + "</corpus>"
                              + "<documents>"
                              + documentXml
                              + "</documents></ThdlPrototypeExport>"
            return xmlString
      }
      generateFeatureAnalysisInfo() {
            let result = '<feature_analysis>'
            for (let key in this.featureAnalysis) {
                  result += "<tag name='" + key + "' default_sub_category='-' default_category='" + key + "' type='contentTagging'/>"
            }
            result += '</feature_analysis>'
            return result
      }
      parseUserDefinedTag(content) {
            try {
               this.UserDefinedTag = ''
               const tagName = {}
               const nodeList = content.firstChild.firstChild.childNodes
               for (let i = 0; i　< nodeList.length; i++) {
                     let node = nodeList[i]
                     if (node.nodeName.substr(0,4) == 'Udef') {    // nodename: Udef_XXX
                           tagName[node.nodeName] = node.nodeName
                           if (!(node.nodeName in this.featureAnalysis)) this.featureAnalysis[node.nodeName] = node.nodeName
                     }
               }
               for (let key in tagName) {
                     this.UserDefinedTag += "<tag default_sub_category='-' default_category='" + key + "' type='contentTagging'>" + key + "</tag>"
               }
            } catch (e) {
               console.log(e)
            }
            
      }
      replaceAngleBrackets(node) { // 2018-09-29 Escape `Angle Brackets`
         let nodeList = node.childeNodes
         if (nodeList) {
            for (let i = 0; i < nodeList.length; i++) {
               replaceAngleBrackets(nodeList[i])
            }
         } else {
            let tmp = node.innerHTML
            tmp = tmp.replace(new RegExp('>', 'g'), '&gt;')
            tmp = tmp.replace(new RegExp('<', 'g'), '&lt;')
            node.innerHTML = tmp
         }
         return node
      }
      convertContent(docContentXml) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(docContentXml, "text/xml");
            this.parseUserDefinedTag(xmlDoc)
            const nodeList = xmlDoc.firstChild.childNodes
            let xmlString = ''
            for (let i = 0; i < nodeList.length; i++) {
                  if (nodeList[i].nodeName === 'Paragraph') {
                        xmlString += this.replaceAngleBrackets(nodeList[i]).outerHTML
                  } else if (nodeList[i].nodeType == 3) { // 2018-09-18 古地契的 DocuXML 並沒有 Paragraph
                        xmlString += nodeList[i].data
                  } else if (nodeList[i].nodeType == 1) {
                        xmlString += this.replaceAngleBrackets(nodeList[i]).outerHTML
                  }
            }
            
            return xmlString
      }
      convertMetadata(docMetadataXml) {
            if (docMetadataXml === undefined) return ''
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(docMetadataXml, "text/xml")
            let xmlString = ''
            if (xmlDoc.firstChild.nodeName === "DocMetadata")
                  xmlString = xmlDoc.firstChild.innerHTML
            return xmlString
      }
      convertTitle(docTitleXml) {
            if (docTitleXml === undefined) return ''
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(docTitleXml, "text/xml")
            let xmlString = ''
            if (xmlDoc.firstChild.nodeName === 'DocTitle')
                  xmlString = xmlDoc.firstChild.innerHTML
            return xmlString
      }
      convertTimeInfo({
            dateOrigStr='',
            dateDynasty='',
            dateEra='',
            dateChNormYear='',
            dateAdDate='',
            dateAdYear='',
            timeseqType='',
            timeseqNumber='',
            }) {
            return "<time_orig_str>" + dateOrigStr + "</time_orig_str>"
                  + "<time_dynasty>" + dateDynasty + "</time_dynasty>"
                  + "<time_era>" + dateEra + "</time_era>"
                  + "<time_norm_year>" + dateChNormYear + "</time_norm_year>"
                  + "<time_ad_date>" + dateAdDate + "</time_ad_date>"
                  + "<time_ad_year>" + dateAdYear + "</time_ad_year>"
                  + "<timeseq_type>" + timeseqType + "</timeseq_type>"
                  + "<timeseq_number>" + timeseqNumber + "</timeseq_number>"
      }
      convertTimeInfo({
            dateOrigStr='',
            dateDynasty='',
            dateEra='',
            dateChNormYear='',
            dateAdDate='',
            dateAdYear='',
            timeseqType='',
            timeseqNumber='',
            }) {
            return "<time_orig_str>" + dateOrigStr + "</time_orig_str>"
                  + "<time_dynasty>" + dateDynasty + "</time_dynasty>"
                  + "<time_era>" + dateEra + "</time_era>"
                  + "<time_norm_year>" + dateChNormYear + "</time_norm_year>"
                  + "<time_ad_date>" + dateAdDate + "</time_ad_date>"
                  + "<time_ad_year>" + dateAdYear + "</time_ad_year>"
                  + "<timeseq_type>" + timeseqType + "</timeseq_type>"
                  + "<timeseq_number>" + timeseqNumber + "</timeseq_number>"
      }
      convertPlaceInfo({
            geoLevel1='',
            geoLevel2='',
            geoLevel3='',
            geoX='',
            geoY='',
            }) {
            return "<geo_level1>" + geoLevel1 + "</geo_level1>"
                  + "<geo_level2>" + geoLevel2 + "</geo_level2>"
                  + "<geo_level3>" + geoLevel3 + "</geo_level3>"
                  + "<geo_longitude>" + geoX + "</geo_longitude>"
                  + "<geo_latitude>" + geoY + "</geo_latitude>"
      }
      parseDocument({
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
            srcFilename='',
            // extraMetadata='',    // DocuSky不支援?
      }) {
            const parser = new DOMParser()
            let xmlString = "<document filename='" + docFilename + "' number='" + number + "'>"
                  + "<corpus corpus_order='" + corpusOrder + "'>" + this.corpus + "</corpus>" // 這邊的 corpus 與 this.corpus 應該相同
                  + "<compilation>" + docCompilation + "</compilation>"
                  + "<doc_content>" + this.convertContent(docContentXml) + "</doc_content>"
                  + "<xml_metadata>" + this.convertMetadata(docMetadataXml) + "</xml_metadata>"
                  + "<title>" + this.convertTitle(docTitleXml) + "</title>"
                  + "<doc_source doc_source_order='" + docSourceOrder + "'>" + docSource + "</doc_source>"
                  + "<doctype>" + docType + "</doctype>"
                  + "<docclass>" + docXmlFormatSubname + "</docclass>"
                  + this.convertTimeInfo(timeInfo)
                  + this.convertPlaceInfo(placeInfo)
                  + "<author>" + author + "</author>"
                  + "<doc_user_tagging>" + this.UserDefinedTag + "</doc_user_tagging>"
                  + "<topic topic_order='" + docTopicL1Order + "'>" + docTopicL1 + "</topic>"
                  + "<doc_id>" + docId + "</doc_id>"
                  + "<doc_time_created>" + docTimeCreated + "</doc_time_created>"
                  + "<xml_format_name>" + xmlFormatName + "</xml_format_name>"
                  + "<src_filename>" + srcFilename + "</src_filename>"
                  + "<db>" + this.db + "</db>"
                  // + "<extra_metadata>" + extraMetadata + "</extra_metadata>"
                  + "</document>"
            const xmlDoc = parser.parseFromString(xmlString, "text/xml")
            return xmlString
      }
}