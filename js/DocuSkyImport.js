var DocuSkyImporter = function() {}

DocuSkyImporter.prototype.generateDocInfo = function(xmlDoc) {
    const root = xmlDoc.firstChild.childNodes   // <ThdlPrototype>
    const documents = root[1].childNodes
    const docList = []
    documents.forEach((document) => {
        docList.push(this.transform(document))
    })
    return docList
}
DocuSkyImporter.prototype.wrapUserDefinedTag = function(xmlString) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString("<div>" + xmlString + "</div>", "text/xml")
    const result = []
    xmlDoc.firstChild.childNodes.forEach((tag) => {
        result.push(tag.innerHTML)
    })
    return result
}
DocuSkyImporter.prototype.transform = function(document) {
    const filename = document.attributes['filename'].value
    const number = (document.attributes['number'])? document.attributes['number'].value : '0'
    const docInfo = {}
    const timeInfo = {}
    const placeInfo = {}
    document.childNodes.forEach((childNode) => {
        // if (childNode.innerHTML === '') continue
        switch (childNode.nodeName) {
            case "corpus":
                docInfo['corpus'] = childNode.innerHTML
                docInfo['corpusOrder'] = (childNode.attributes['corpus_order'])? childNode.attributes['corpus_order'].value : "0"
                break;
            case "compilation":
                docInfo['docCompilation'] = childNode.innerHTML
                break;
            case "doc_content":
                docInfo['docContentXml'] = "<Content>" + childNode.innerHTML + "</Content>"
                break;
            case "xml_metadata":
                docInfo['docMetadataXml'] = "<DocMetadata>" + childNode.innerHTML + "</DocMetadata>"
                break;
            case "title":
                docInfo['docTitleXml'] = "<DocTitle>" + childNode.innerHTML + "</DocTitle>"
                break;
            case "doc_source":
                docInfo['docSource'] = childNode.innerHTML
                docInfo['docSourceOrder'] = (childNode.attributes['doc_source_order'])? childNode.attributes['doc_source_order'].value : "0"
                break;    
            case "doctype":
                docInfo['docType'] = childNode.innerHTML
                break;
            case "docclass":
                docInfo['docXmlFormatSubname'] = childNode.innerHTML
                break;
            case "time_orig_str":
                timeInfo['dateOrigStr'] = childNode.innerHTML
                break;
            case "time_dynasty":
                timeInfo['dateDynasty'] = childNode.innerHTML
                break;
            case "time_era":
                timeInfo['dateEra'] = childNode.innerHTML
                break;
            case "time_norm_year":
                timeInfo['dateChNormYear'] = childNode.innerHTML
                break;
            case "time_ad_date":
                timeInfo['dateAdDate'] = childNode.innerHTML
                break;
            case "time_ad_year":
                timeInfo['dateAdYear'] = childNode.innerHTML
                break;
            case "timeseq_type":
                timeInfo['timeseqType'] = childNode.innerHTML
                break;
            case "timeseq_number":
                timeInfo['timeseqNumber'] = childNode.innerHTML
                break;
            case "geo_level1":
                placeInfo['geoLevel1'] = childNode.innerHTML
                break;
            case "geo_level2":
                placeInfo['geoLevel2'] = childNode.innerHTML
                break;
            case "geo_level3":
                placeInfo['geoLevel3'] = childNode.innerHTML
                break;
            case "geo_longitude":
                placeInfo['geoX'] = childNode.innerHTML
                break;
            case "geo_latitude":
                placeInfo['geoY'] = childNode.innerHTML
                break;
            case "author":
                docInfo['docAuthor'] = childNode.innerHTML
                break;
            case "doc_user_tagging":
                docInfo['docUserTagging'] = this.wrapUserDefinedTag(childNode.innerHTML)
                break;
            case "topic":
                docInfo['docTopicL1'] = childNode.innerHTML
                docInfo['docTopicL1Order'] = (childNode.attributes['topic_order'])? childNode.attributes['topic_order'].value : "0"
                break;
            case "doc_id":
                docInfo['docId'] = childNode.innerHTML
                break;
            case "doc_time_created":
                docInfo['docTimeCreated'] = childNode.innerHTML
                break;
            case "xml_format_name":
                docInfo['xmlFormatName'] = childNode.innerHTML
                break;
            case "src_filename":
                docInfo['srcFilename'] = childNode.innerHTML
                break;
            case "db":
                docInfo['db'] = childNode.innerHTML
                break;
            // case "extra_metadata":
            //     docInfo['extraMetadata'] = childNode.innerHTML
            //     break;
            default:
                console.log('Unknow information: ' + childNode.nodeName)
                break;
        }
    })
    docInfo['docFilename'] = filename
    docInfo['timeInfo'] = timeInfo
    docInfo['placeInfo'] = placeInfo 
    const {db, corpus} = docInfo
    delete docInfo['db']                // should not upload
    delete docInfo['docTopicL1Order']   // docusky upload error 4
    delete docInfo['docUserTagging']    // docusky upload error 4
    for (let key in docInfo) {  // 空欄位
        if (docInfo[key].length == 0) delete docInfo[key]
    }
    return { db, corpus , docInfo }
}

// class DocuSkyImporter {
//     generateDocInfo(xmlDoc) {
//         const root = xmlDoc.firstChild.childNodes   // <ThdlPrototype>
//         const documents = root[1].childNodes
//         const docList = []
//         documents.forEach((document) => {
//             docList.push(this.transform(document))
//         })
//         return docList
//     }
//     wrapUserDefinedTag(xmlString) {
//         const parser = new DOMParser()
//         const xmlDoc = parser.parseFromString("<div>" + xmlString + "</div>", "text/xml")
//         const result = []
//         xmlDoc.firstChild.childNodes.forEach((tag) => {
//             result.push(tag.innerHTML)
//         })
//         return result
//     }
//     transform(document) {
//         const filename = document.attributes['filename'].value
//         const number = (document.attributes['number'])? document.attributes['number'].value : '0'
//         const docInfo = {}
//         const timeInfo = {}
//         const placeInfo = {}
//         document.childNodes.forEach((childNode) => {
//             // if (childNode.innerHTML === '') continue
//             switch (childNode.nodeName) {
//                 case "corpus":
//                     docInfo['corpus'] = childNode.innerHTML
//                     docInfo['corpusOrder'] = (childNode.attributes['corpus_order'])? childNode.attributes['corpus_order'].value : "0"
//                     break;
//                 case "compilation":
//                     docInfo['docCompilation'] = childNode.innerHTML
//                     break;
//                 case "doc_content":
//                     docInfo['docContentXml'] = "<Content>" + childNode.innerHTML + "</Content>"
//                     break;
//                 case "xml_metadata":
//                     docInfo['docMetadataXml'] = "<DocMetadata>" + childNode.innerHTML + "</DocMetadata>"
//                     break;
//                 case "title":
//                     docInfo['docTitleXml'] = "<DocTitle>" + childNode.innerHTML + "</DocTitle>"
//                     break;
//                 case "doc_source":
//                     docInfo['docSource'] = childNode.innerHTML
//                     docInfo['docSourceOrder'] = (childNode.attributes['doc_source_order'])? childNode.attributes['doc_source_order'].value : "0"
//                     break;    
//                 case "doctype":
//                     docInfo['docType'] = childNode.innerHTML
//                     break;
//                 case "docclass":
//                     docInfo['docXmlFormatSubname'] = childNode.innerHTML
//                     break;
//                 case "time_orig_str":
//                     timeInfo['dateOrigStr'] = childNode.innerHTML
//                     break;
//                 case "time_dynasty":
//                     timeInfo['dateDynasty'] = childNode.innerHTML
//                     break;
//                 case "time_era":
//                     timeInfo['dateEra'] = childNode.innerHTML
//                     break;
//                 case "time_norm_year":
//                     timeInfo['dateChNormYear'] = childNode.innerHTML
//                     break;
//                 case "time_ad_date":
//                     timeInfo['dateAdDate'] = childNode.innerHTML
//                     break;
//                 case "time_ad_year":
//                     timeInfo['dateAdYear'] = childNode.innerHTML
//                     break;
//                 case "timeseq_type":
//                     timeInfo['timeseqType'] = childNode.innerHTML
//                     break;
//                 case "timeseq_number":
//                     timeInfo['timeseqNumber'] = childNode.innerHTML
//                     break;
//                 case "geo_level1":
//                     placeInfo['geoLevel1'] = childNode.innerHTML
//                     break;
//                 case "geo_level2":
//                     placeInfo['geoLevel2'] = childNode.innerHTML
//                     break;
//                 case "geo_level3":
//                     placeInfo['geoLevel3'] = childNode.innerHTML
//                     break;
//                 case "geo_longitude":
//                     placeInfo['geoX'] = childNode.innerHTML
//                     break;
//                 case "geo_latitude":
//                     placeInfo['geoY'] = childNode.innerHTML
//                     break;
//                 case "author":
//                     docInfo['docAuthor'] = childNode.innerHTML
//                     break;
//                 case "doc_user_tagging":
//                     docInfo['docUserTagging'] = this.wrapUserDefinedTag(childNode.innerHTML)
//                     break;
//                 case "topic":
//                     docInfo['docTopicL1'] = childNode.innerHTML
//                     docInfo['docTopicL1Order'] = (childNode.attributes['topic_order'])? childNode.attributes['topic_order'].value : "0"
//                     break;
//                 case "doc_id":
//                     docInfo['docId'] = childNode.innerHTML
//                     break;
//                 case "doc_time_created":
//                     docInfo['docTimeCreated'] = childNode.innerHTML
//                     break;
//                 case "xml_format_name":
//                     docInfo['xmlFormatName'] = childNode.innerHTML
//                     break;
//                 case "src_filename":
//                     docInfo['srcFilename'] = childNode.innerHTML
//                     break;
//                 case "db":
//                     docInfo['db'] = childNode.innerHTML
//                     break;
//                 // case "extra_metadata":
//                 //     docInfo['extraMetadata'] = childNode.innerHTML
//                 //     break;
//                 default:
//                     console.log('Unknow information: ' + childNode.nodeName)
//                     break;
//             }
//         })
//         docInfo['docFilename'] = filename
//         docInfo['timeInfo'] = timeInfo
//         docInfo['placeInfo'] = placeInfo 
//         const {db, corpus} = docInfo
//         delete docInfo['db']                // should not upload
//         delete docInfo['docTopicL1Order']   // docusky upload error 4
//         delete docInfo['docUserTagging']    // docusky upload error 4
//         for (let key in docInfo) {  // 空欄位
//             if (docInfo[key].length == 0) delete docInfo[key]
//         }
//         return { db, corpus , docInfo }
//     }
// }