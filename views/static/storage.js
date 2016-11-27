var storageClient = { 
   
    addCitation: function(citation) {
        var citations = JSON.parse(localStorage.getItem("citations"));
        citations.push(citation);
        localStorage.setItem("citations", JSON.stringify(citations));
    },
    
    deleteCitation: function(citationIndex) {
        var citations = JSON.parse(localStorage.getItem("citations"));
        citations.splice(citationIndex, 1);
        localStorage.setItem("citations", JSON.stringify(citations));
    },
    
    forEach : function( everyCitation) {
        var citations = JSON.parse(localStorage.getItem("citations"));
        citations.forEach(everyCitation);
        localStorage.setItem("citations", JSON.stringify(citations));
    }
    
} ; 



