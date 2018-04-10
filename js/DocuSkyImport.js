const importDocuXml = (xmlDoc) => {
    const root = xmlDoc.firstChild.childNodes   // <ThdlPrototype>
    const db = root[0]
    const corpus = root[1]
    const documents = root[2].childNodes
    const docList = []
    documents.forEach((document) => {
        docList.push(transform(document))
    })
    return {db, corpus, docList}
}
const wrapUserDefinedTag = (xmlString) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString("<div>" + xmlString + "</div>", "text/xml")
    const result = []
    xmlDoc.firstChild.childNodes.forEach((tag) => {
        result.push(tag.innerHTML)
    })
    return result
}
const transform = (document) => {
    const filename = document.attributes[0].value
    const number = document.attributes[1].value
    const docInfo = {}
    const timeInfo = {}
    const placeInfo = {}
    document.childNodes.forEach((childNode) => {
        // if (childNode.innerHTML === '') continue
        switch (childNode.nodeName) {
            case "corpus":
                docInfo['corpus'] = childNode.innerHTML
                docInfo['corpusOrder'] = childNode.attributes[0].value
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
                docInfo['docSourceOrder'] = childNode.attributes[0].value
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
                docInfo['docUserTagging'] = wrapUserDefinedTag(childNode.innerHTML)
                break;
            case "topic":
                docInfo['docTopicL1'] = childNode.innerHTML
                docInfo['docTopicL1Order'] = childNode.attributes[0].value
                break;
            case "doc_id":
                docInfo['docId'] = childNode.innerHTML
                break;
            case "doc_time_created":
                docInfo['doc_time_created'] = childNode.innerHTML
                break;
            case "xml_format_name":
                docInfo['xmlFormatName'] = childNode.innerHTML
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
    return { number , docInfo }
}