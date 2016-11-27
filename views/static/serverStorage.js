
var storageClient = { 
    
    addCitation: function(citation) { //makes a post request for us to the URL, set the data to be citation, and then it will call the success call back when its done and receives a response 
        $.ajax({
            url : "/addcitation",
            type: "POST",
            data: { citation: citation},
            dataType: "text",
            success: function() {
                alert("saved");
            }
            
        })
    },
    
    deleteCitation: function(citationIndex) {
        $.ajax({
            url : "/deletecitation",
            type: "POST",
            data: { index: citationIndex},
            dataType: "text",
            success: function() {
                alert("saved");
            }
            
        })
    },
    
    forEach : function( everyCitation) {
        
        $.ajax({
            url : "/getcitations",
            type: "GET",
            dataType: "json",
            success: function(result, status) {
                        console.log(result);
                        var citations = result.citations;
                        citations.forEach(everyCitation);
            }
            
        })
        
    
    }
    
} ; 






